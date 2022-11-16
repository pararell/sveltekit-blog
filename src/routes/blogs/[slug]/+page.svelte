<script>
	import { marked } from 'marked';
	import Comments from '$lib/Comments.svelte';
	import { api } from '$lib/api';
	import { goto, invalidateAll } from '$app/navigation';
	import { blogModelForm, ADMIN_EMAIL } from '$lib/constants';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	export let data;
	let id = '';
	let blogForm = Object.entries(blogModelForm);

	let unsubscribe = page.subscribe((pageVal) => {
		if (pageVal.data.blog) {
			const blog = pageVal.data.blog;
			id = blog.id;
			const pageKeys = Object.keys(blog);

			blogForm = blogForm.map((keyval) => {
				const found = pageKeys.includes(keyval[0]);
				if (found) {
					keyval[1].value = blog[keyval[0]];
					return keyval;
				}

				return keyval;
			});
		}
	});

	onDestroy(() => unsubscribe());

	const submitForm = async (event) => {
		const formData = event.detail;
		if (id && formData.title) {
			const data = {
				...formData,
				id: parseFloat(id),
				slug: formData.title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-'),
				categories: formData.categories ? formData.categories.split(',') : []
			};
			const res = await api({ url: `api/blogs/update`, method: 'PATCH', data });

			if (res) {
				invalidateAll();
				goto('/blogs/' + res.body.slug);
			}
		}
	};

	const removeBlog = async () => {
		if (id) {
			const res = await api({ url: `api/blogs/delete/` + id, method: 'DELETE' });

			if (res) {
				const resBlogs = await api({ url: `api/blogs/` });

				if (resBlogs) {
					invalidateAll();
				}
			}
		}
	};
</script>

<svelte:head>
	<title>{$page.data?.blog?.title}</title>
</svelte:head>

{#if $page.data?.blog}
	<div class="container">
		<h1>{$page.data?.blog.title}</h1>

		<div class="content">
			{@html marked($page.data?.blog.content)}
		</div>

		<span class="date">{new Date($page.data?.blog.date).toLocaleDateString()}</span>

		{#if $page.data?.user?.email === ADMIN_EMAIL}
			<FormWithMarkdown
				form={blogForm}
				content={$page.data?.blog.content}
				on:submitForm={submitForm}
			/>

			<form on:submit|preventDefault={removeBlog}>
				<input type="hidden" name="id" value={id} />
				<button class="btn delete btn-delete" aria-label="Delete blog"> Delete Page</button>
			</form>
		{/if}

		{#if browser}
			<Comments host={data.url.host} slug={data.params.slug} />
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
</style>
