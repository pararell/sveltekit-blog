<script>
	import { marked } from 'marked';
	import { api } from '$lib/api';
	import { onDestroy } from 'svelte';
	import { pageModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	let pageForm = Object.entries(pageModelForm);
	let id = '';
	let showEdit = true;

	let unsubscribe = page.subscribe(pageVal => {
		if (pageVal.data.pageWithContent) {
			const pageWithContent = pageVal.data.pageWithContent;
			id = pageWithContent.id;
			const pageKeys = Object.keys(pageWithContent);

			pageForm = pageForm.map((keyval) => {
				const found = pageKeys.includes(keyval[0]);
				if (found) {
					keyval[1].value = pageWithContent[keyval[0]];
					return keyval;
				}

				return keyval;
			});
		}
	})

	onDestroy(() => unsubscribe());

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
				invalidateAll();
			}
		}
	};

	const removePage = async () => {
		if (id) {
			const res = await api({ url: `api/pages/delete/` + id, method: 'DELETE' });

			if (res) {
				const resPages = await api({ url: `api/pages/` });

				if (resPages) {
					invalidateAll();
					goto('/');
				}
			}
		}
	};
</script>

<svelte:head>
	<title>{$page.data?.pageWithContent?.metaTitle}</title>
</svelte:head>

{#if $page.data?.pageWithContent}
	{@html marked($page.data?.pageWithContent.content)}

	{#if $page.data?.user?.email === ADMIN_EMAIL && $page.data?.pageWithContent.url !== '/'}
		{#if showEdit}
			<div class="edit-wrap">
				<div class="container">
					{#await import("$lib/FormWithMarkdown.svelte") then FormWithMarkdown}
					  <FormWithMarkdown.default
							form={pageForm}
							content={$page.data?.pageWithContent.content}
							on:submitForm={submitForm}
						/>
					{/await}

					<form on:submit|preventDefault={removePage}>
						<input type="hidden" name="id" value={id} />
						<button class="btn delete btn-delete" aria-label="Delete blog"> Delete Page</button>
					</form>
				</div>
			</div>
		{/if}
	{/if}
	<button class="btn btn-edit" on:click={() => (showEdit = !showEdit)}>Toggle Edit</button>
{/if}

<style>
	.btn-delete {
		display: block;
		max-width: 200px;
		margin: 30px auto;
	}

	.edit-wrap {
		position: relative;
		background: #fff;
		overflow: visible;
		width: 100%;
		z-index: 100;
	}
</style>
