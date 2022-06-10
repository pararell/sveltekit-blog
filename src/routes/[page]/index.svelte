<script context="module">
	import { pageWithContent } from '$lib/store';

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
	import { _ } from 'svelte-i18n';
	import marked from 'marked';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';
	import { api } from '$lib/api';
	import { onDestroy } from 'svelte';
	import { pageModelForm } from '$lib/constants';

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
</script>

<svelte:head>
	<title>{$pageWithContent?.title}</title>
</svelte:head>

{#if $pageWithContent}
	<div class="container">
		<div class="content">
			{@html marked($pageWithContent.content)}
		</div>
      <FormWithMarkdown form={pageForm} on:submitForm={submitForm} />
	</div>
{/if}

<style>
	.content {
		margin: 2rem 0 4rem 0;
	}

	.content :global(h2) {
		font-size: 1.6rem;
		font-weight: 600;
		color: #000;
	}

	.content :global(p) {
		font-size: 1.2rem;
		text-align: justify;
	}

	.content :global(pre) {
		background-color: #f9f9f9;
		box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
		padding: 0.5em;
		border-radius: 2px;
		overflow-x: auto;
	}

	.content :global(pre) :global(code) {
		background-color: transparent;
		padding: 0;
	}

	.content :global(ul) {
		line-height: 1.5;
	}

	.content :global(li) {
		margin: 0 0 0.5rem 0;
		font-size: 1.2rem;
	}
</style>
