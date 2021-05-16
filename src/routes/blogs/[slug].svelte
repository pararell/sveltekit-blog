<script context="module">
	import { blog } from '$lib/store/store';

	export const load = async ({ fetch, page }) => {
		const res = await fetch(`/blogs/${page.params.slug}.json`);

		if (res.ok) {
			const blogFromApi = await res.json();
			blog.next(blogFromApi);
			return { props: {} };
		}

		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
</script>

<script>
	import marked from 'marked';
	import Markdown from '$lib/Markdown.svelte';
</script>

<svelte:head>
	<title>{$blog?.title}</title>
</svelte:head>

{#if $blog}
	<h1>{$blog.title}</h1>
	<span class="date">{new Date($blog.date).toLocaleDateString()}</span>

	<div class="content">
		{@html marked($blog.content)}
	</div>

	<div id="disqus_thread" />

	<Markdown type={'update'} title={$blog.title} source={$blog.content} id={$blog.id} />
{/if}



<style>
	h1 {
		margin: 5px 0;
		color: #000;
	}

	.content {
		margin: 2em 0 4em 0;
	}

	.content :global(h2) {
		font-size: 1.6em;
		font-weight: 600;
		color: #000;
	}

	.content :global(p) {
		font-size: 1.2em;
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
		margin: 0 0 0.5em 0;
		font-size: 1.2em;
	}
</style>
