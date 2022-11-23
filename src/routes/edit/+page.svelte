<script>
	import { api } from '$lib/api';
	import { page } from '$app/stores';
	import { pageModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { goto, invalidateAll } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { preparePageForm } from '$lib/utils';
	import { marked } from 'marked';

	let pageForm = Object.entries(pageModelForm);
	let id = '';
	let showEdit = true;
	export let data;

	let unsubscribe = page.subscribe((pageVal) => {
		if (pageVal.data.pageToEdit) {
			const pageToEdit = pageVal.data.pageToEdit;
			id = pageToEdit.id;
			pageForm = preparePageForm(pageForm, pageToEdit);
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
					invalidateAll().then(() => {
						goto('/');
					});
				}
			}
		}
	};
</script>

<svelte:head>
	<title>{$page.data?.pageToEdit?.metaTitle}</title>
</svelte:head>
{#if showEdit}
	<form id="search">
		<input type="search" name="edit" placeholder="Search pages&hellip;" class="draw" />
		<button class="btn" type="submit">Search</button>
	</form>
{/if}
{#if $page.data?.pageToEdit}
	{@html marked($page.data.pageToEdit.content)}

	{#if data.paramsPage === 'contact'}
		{#await import('$lib/ContactForm.svelte') then ContactForm}
			<div class="container">
				<ContactForm.default />
			</div>
		{/await}
	{/if}
	{#if $page.data?.user?.email === ADMIN_EMAIL && $page.data?.pageToEdit.pathname !== '/'}
		{#if showEdit}
			<div class="edit-wrap">
				<div class="container">
					{#await import('$lib/FormWithMarkdown.svelte') then FormWithMarkdown}
						<FormWithMarkdown.default
							form={pageForm}
							content={$page.data?.pageToEdit.content}
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

	#search {
		display: flex;
		margin: 20px auto;
		position: fixed;
		top: 50px;
		left: 20px;
		padding: 5px;
		z-index: 100;
	}

	#search input {
		background: transparent;
		border-color: #fff;
		color: #fff;
		border-style: solid;
		border-width: 1px;
		border-radius: 50px;
		width: 100%;
		padding: 0.5em 1em 0.4em 1em;
		transition: border-color 0.3s ease;
		line-height: 1;
		font-size: 14px;
		border-color: #b4b9ba;
		color: #000;
		max-width: 300px;
	}

	#search button {
		max-width: 100px;
		padding: 5px;
		margin: 0 10px;
	}
</style>