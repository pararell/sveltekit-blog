<script context="module">
	import { pages, pageWithContent, user } from '$lib/store';

	export const load = async ({ fetch, url, params }) => {
		const resPage = await api({ url: `api/pages/${params.page}`, serverFetch: fetch });

		if (resPage) {
			pageWithContent.next(resPage.body);
			return { props: { url, params } };
		}

		return {
			props: {
				url,
				params
			}
		};
	};
</script>

<script>
	import { marked } from 'marked';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';
	import { api } from '$lib/api';
	import { onDestroy } from 'svelte';
	import { pageModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { goto } from '$app/navigation';

	let pageForm = Object.entries(pageModelForm);
	let id = '';
	let pageShow;

	let pageSub = pageWithContent.subscribe((pageFound) => {
		pageShow = pageFound;

		if (pageShow) {
			const pageKeys = Object.keys(pageFound);
			id = pageFound.id;

			pageForm = pageForm.map((keyval) => {
				const found = pageKeys.includes(keyval[0]);
				if (found) {
					keyval[1].value = pageFound[keyval[0]];
					return keyval;
				}

				return keyval;
			});
		}
	});

	onDestroy(() => pageSub.unsubscribe());

	const submitForm = async (event) => {
		const formData = event.detail;

		if (formData.title && id) {
			const data = {
				id: parseFloat(id),
				...formData,
				slug: formData.title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-')
			};

			const res = await api({ url: `api/pages/update`, method: 'PATCH', data });
			if (res) {
				pageWithContent.next(res.body);
			}
		}
	};

	const removePage = async () => {
		if (id) {
			const res = await api({ url: `api/pages/delete/` + id, method: 'DELETE' });

			if (res) {
				const resPages = await api({ url: `api/pages/` });

				if (resPages) {
					pages.next(resPages.body);
					goto('/');
				}
			}
		}
	};
</script>

<svelte:head>
	<title>{$pageWithContent?.metaTitle}</title>
</svelte:head>

{#if $pageWithContent}
{@html marked($pageWithContent.content)}

	<div class="container">

		{#if $user?.email === ADMIN_EMAIL && $pageWithContent.url !== '/'}
		  <FormWithMarkdown form={pageForm} content={$pageWithContent.content} on:submitForm={submitForm} />

			<form on:submit|preventDefault={removePage}>
				<input type="hidden" name="id" value={id} />
				<button class="btn delete btn-delete" aria-label="Delete blog"> Delete Page</button>
			</form>
		{/if}

	</div>
{/if}

<style>
	.btn-delete {
		display: block;
		max-width: 200px;
		margin: 30px auto;
	}
</style>
