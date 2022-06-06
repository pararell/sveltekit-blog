<script context="module">
	import { blog, blogs } from '$lib/store';

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
	export let url, params;
	

	const handleRedirect = async (event) => {
		const resBlogs = await api({ url: 'api/blogs', serverFetch: fetch });
		if (resBlogs) {
			blogs.next(resBlogs.body);
		}
	};
</script>

<svelte:head>
	<title>{$blog?.title}</title>
</svelte:head>

{#if $blog}
	<h1>{$blog.title}</h1>

	<div class="content">
		{@html marked($blog.content)}
	</div>

	<span class="date">{new Date($blog.date).toLocaleDateString()}</span>

	<Markdown type={'update'} {...$blog} on:redirectAction={handleRedirect} />
{/if}

<Comments host={url.host} slug={params.slug} />

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
</style>
