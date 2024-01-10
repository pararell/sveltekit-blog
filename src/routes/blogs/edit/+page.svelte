<script>
	import { api } from '$lib/api';
	import { goto, invalidateAll } from '$app/navigation';
	import { blogModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { preparePageForm, prepareSlug } from '$lib/utils';
	import { marked } from 'marked';

	let id = '';
	let authorization = {};
	let blogForm = Object.entries(blogModelForm);

	let unsubscribe = page.subscribe((pageVal) => {
		if (pageVal.data.blog) {
			const blog = pageVal.data.blog;
			id = blog.id;
			blogForm = preparePageForm(blogForm, blog);
		}
	  authorization = pageVal.data?.token ? { authorization: pageVal.data.token } : {};
	});

	onDestroy(() => unsubscribe());

	const submitForm = async (event) => {
		const formData = event.detail;
		if (id && formData.title) {
			const data = {
				...formData,
				id: parseFloat(id),
				slug: prepareSlug(formData.title),
				categories: formData.categories ? formData.categories : null
			};
			const res = await api({ url: `api/v1/blogs/update`, method: 'PATCH', data, authorization });

			if (res) {
				invalidateAll();
			}
		}
	};

	const removeBlog = async () => {
		if (id) {
			const res = await api({ url: `api/v1/blogs/delete/` + id, method: 'DELETE', authorization });

			if (res) {
				const resBlogs = await api({ url: `api/v1/blogs/`, authorization });

				if (resBlogs) {
					invalidateAll().then(() => {
						goto('/blogs');
					});
				}
			}
		}
	};
</script>

<svelte:head>
	<title>{$page.data?.blog?.title}</title>
</svelte:head>

<form id="search">
	<input
		type="search"
		autocomplete="off"
		list="blogs"
		name="edit"
		placeholder="Search pages&hellip;"
		class="draw"
	/>
	<datalist id="blogs">
		{#each $page.data?.blogs as blog}
			<option>{blog.slug}</option>
		{/each}
	</datalist>
	<button class="btn" type="submit">Search</button>
</form>

{#if $page.data?.blog}
	<div class="container">
		<h1>{$page.data?.blog.title}</h1>

		<div class="content">
			{@html marked($page.data?.blog.content)}
		</div>

		<span class="date">{new Date($page.data?.blog.date).toLocaleDateString()}</span>

		{#if $page.data?.user?.email === ADMIN_EMAIL}
			{#await import('$lib/FormWithMarkdown.svelte') then FormWithMarkdown}
				<FormWithMarkdown.default
					form={blogForm}
					content={$page.data?.blog.content}
					on:submitForm={submitForm}
				/>
			{/await}
			<form on:submit|preventDefault={removeBlog}>
				<input type="hidden" name="id" value={id} />
				<button class="btn delete btn-delete" aria-label="Delete blog"> Delete Page</button>
			</form>
		{/if}
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

	.date {
		text-align: right;
		margin-right: 0;
		margin-left: auto;
		display: block;
		color: var(--secondary-color);
	}

	.btn-delete {
		display: block;
		max-width: 200px;
		margin: 30px auto;
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
