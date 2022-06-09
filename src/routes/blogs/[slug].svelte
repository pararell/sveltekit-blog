<script context="module">
	import { blog, blogs, user } from '$lib/store';

	export const load = async ({ fetch, url, params }) => {
		const res = await fetch(`/blogs/${params.slug}.json`);

		if (res.ok) {
			const blogFromApi = await res.json();
			blog.next(blogFromApi);
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
	import marked from 'marked';
	import Markdown from '$lib/Markdown.svelte';
	import Comments from '$lib/Comments.svelte';
	import { api } from '$lib/api';
	import { goto } from '$app/navigation';
	import { ADMIN_EMAIL } from '$lib/constants';
	import { _, locale } from 'svelte-i18n';
	import { onDestroy } from 'svelte';
	import { take } from 'rxjs';
	export let url, params;
	export let title = '';
	export let imgLink = '';
	export let description = '';
	export let categories = '';
	export let comments = [];
	export let id = '';
	export let date = new Date().toISOString().substr(0, 10);
	export let content = '#Title';

  blog.pipe(take(1)).subscribe((b) => {
		content = b.content;
		title = b.title;
		imgLink = b.imgLink;
		description = b.description;
		categories = b.categories;
		id = b.id;
		date = b.date;
		comments = b.comments;
	});
	let error = '';


	const handleRedirect = async (event) => {
		const resBlogs = await api({ url: 'api/blogs', serverFetch: fetch });
		if (resBlogs) {
			blogs.next(resBlogs.body);
		}
	};

	const submitForm = async (method) => {
		if (method === 'PATCH' && id && title) {
			const data = {
				id: parseFloat(id),
				title,
				slug: title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-'),
				description,
				imgLink,
				content,
				categories: categories ? categories.split(',') : [],
				date,
				lang: $locale,
				comments
			};
			const res = await api({ url: `api/blogs/update`, method, data });
			blog.next(res.body);

			handleRedirect();
			goto('/blogs/' + res.body.slug);
		}

		if (method === 'DELETE' && id) {
			const res = await api({ url: `api/blogs/delete/` + id, method });

			if (res) {
				handleRedirect();
				goto('/blogs');
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
		{@html marked(content)}
	</div>

	<span class="date">{new Date($blog.date).toLocaleDateString()}</span>

	{#if $user?.Email === ADMIN_EMAIL}
		<form on:submit|preventDefault={() => submitForm('PATCH')} class="new">
			<h1 class="header-title">Update blog</h1>
			<div class="header-cta">
				<input type="text" name="title" bind:value={title} placeholder="Title" />
				<input type="text" name="imgLink" bind:value={imgLink} placeholder="Image link" />
				<input type="text" name="description" bind:value={description} placeholder="Description" />
				<input type="text" name="categories" bind:value={categories} placeholder="Categories" />
				<input type="date" name="date" bind:value={date} placeholder="Date" />
				<input type="hidden" name="id" value={id} />
				<input type="hidden" name="lang" value={$locale} />
				<button class="btn submit" disabled={!title || !content}> Save</button>
			</div>
			{#if error}
				<p class="error">
					{error}
				</p>
			{/if}

			<Markdown type={'update'} bind:content={content} />
		</form>

		<form on:submit|preventDefault={() => submitForm('DELETE')}>
			<input type="hidden" name="id" value={id} />
			<button class="btn delete" aria-label="Delete blog"> Delete Blog</button>
		</form>
	{/if}

	<Comments host={url.host} slug={params.slug} />
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

	.header-title {
		margin: 0 0 10px 0;
		text-align: center;
	}

	.header-cta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
		position: relative;
	}

	input {
		min-width: 50%;
		border-radius: 4px;
		padding: 0 10px;
		box-shadow: 0px 0px 4px #ccc;
		border: 1px solid transparent;
		min-height: 35px;
		outline: none;
		margin-right: 15px;
	}
</style>
