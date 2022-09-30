<script>
	import { marked } from 'marked';
	import Comments from '$lib/Comments.svelte';
	import { api } from '$lib/api';
	import { goto } from '$app/navigation';
	import { blogModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { onDestroy } from 'svelte';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';
	import { blog, blogs, user } from '$lib/store';

	export let data;
	let id = '';
	let blogForm = Object.entries(blogModelForm);
	let blogShow;

	let blogSub = blog.subscribe((blogFound) => {
		blogShow = blogFound;

		if (blogShow) {
			const blogKeys = Object.keys(blogFound);
			id = blogFound.id;

			blogForm = blogForm.map((keyval) => {
				const found = blogKeys.includes(keyval[0]);
				if (found) {
					keyval[1].value = blogFound[keyval[0]];
					return keyval;
				}

				return keyval;
			});
		}
	});

	onDestroy(() => blogSub.unsubscribe());

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
				blog.next(res.body);
				goto('/blogs/' + res.body.slug);

				const resBlogs = await api({ url: `api/blogs/` });
				if (resBlogs) {
					blogs.next(resBlogs.body);
				}
			}
		}
	};

	const removeBlog = async () => {
		if (id) {
			const res = await api({ url: `api/blogs/delete/` + id, method: 'DELETE' });

			if (res) {
				const resBlogs = await api({ url: `api/blogs/` });

				if (resBlogs) {
					blogs.next(resBlogs.body);
					goto('/blogs');
				}
			}
		}
	};
</script>

<svelte:head>
	<title>{$blog?.title}</title>
</svelte:head>

{#if $blog}
	<div class="container">
		<h1>{$blog.title}</h1>

		<div class="content">
			{@html marked($blog.content)}
		</div>

		<span class="date">{new Date($blog.date).toLocaleDateString()}</span>

		{#if $user?.email === ADMIN_EMAIL}
			<FormWithMarkdown form={blogForm} content={$blog.content} on:submitForm={submitForm} />

			<form on:submit|preventDefault={removeBlog}>
				<input type="hidden" name="id" value={id} />
				<button class="btn delete btn-delete" aria-label="Delete blog"> Delete Page</button>
			</form>
		{/if}

		<Comments host={data.url.host} slug={data.params.slug} />
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
