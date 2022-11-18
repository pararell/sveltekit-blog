<script>
	import { marked } from 'marked';
	import ContactForm from '$lib/ContactForm.svelte';
	import { api } from '$lib/api';
	import { page } from '$app/stores';
	import { pageModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { goto, invalidateAll } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { preparePageForm } from '$lib/utils';

	let pageForm = Object.entries(pageModelForm);
	let id = '';
	let showEdit = true;
	export let data;

	let unsubscribe = page.subscribe((pageVal) => {
		if (pageVal.data.pageWithContent) {
			const pageWithContent = pageVal.data.pageWithContent;
			id = pageWithContent.id;
			pageForm = preparePageForm(pageForm, pageWithContent);
		}
	});

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
	{@html marked($page.data.pageWithContent.content)}

	{#if data.paramsPage === 'contact'}
		<div class="container">
			<ContactForm />
		</div>
	{/if}

	{#if $page.data?.user?.email === ADMIN_EMAIL && $page.data?.pageWithContent.url !== '/'}
		{#if showEdit}
			<div class="edit-wrap">
				<div class="container">
					{#await import('$lib/FormWithMarkdown.svelte') then FormWithMarkdown}
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
		<button class="btn btn-edit" on:click={() => (showEdit = !showEdit)}>Toggle Edit</button>
	{/if}
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

	.btn-edit {
		position: fixed;
		top: 100px;
		max-width: 100px;
		right: 20px;
		padding: 5px;
		z-index: 100;
	}
</style>
