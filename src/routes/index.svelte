<script context="module">
	import { pageWithContent, user } from '$lib/store';

	export const load = async ({ fetch, url, params }) => {
		const resPages = await api({ url: 'api/pages/home', serverFetch: fetch });

		if (resPages) {
			pageWithContent.next(resPages.body);
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
	import { _ } from 'svelte-i18n';
	import { marked } from 'marked';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';
	import { api } from '$lib/api';
	import { onDestroy } from 'svelte';
	import { pageModelForm, ADMIN_EMAIL } from '$lib/constants';

	let pageForm = Object.entries(pageModelForm);

	let homePage;
	let id = '';

	let pageSub = pageWithContent.subscribe((pageFound) => {
		homePage = pageFound;

		if (homePage) {
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

		if (formData.title) {
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
</script>

<svelte:head>
	<title>{homePage ? homePage.metaTitle : $_('home')}</title>
</svelte:head>

{#if homePage}
	<div class="homePage">
		{@html marked(homePage.content)}
	</div>

	{#if $user?.email === ADMIN_EMAIL}
		<div class="container">
			<FormWithMarkdown form={pageForm} content={homePage.content} on:submitForm={submitForm} />
		</div>
	{/if}
{/if}
