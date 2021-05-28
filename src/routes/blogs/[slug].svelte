<script context="module">
	import { blog, blogs, config, disqusLoaded } from '$lib/store/store';
	import { setDisqus, resetDisqus } from '$lib/utils';

	export const load = async ({ fetch, page }) => {
		const res = await fetch(`/blogs/${page.params.slug}.json`);

		if (res.ok) {
			const blogFromApi = await res.json();
			blog.next(blogFromApi);
			return { props: { page } };
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
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import { filter } from 'rxjs/internal/operators/filter.js';
	import { take } from 'rxjs/internal/operators/take.js';
	import { map } from 'rxjs/internal/operators/map.js';
	import { mergeMap } from 'rxjs/internal/operators/mergeMap.js';
	export let page;

	onMount(() => {
		config
			.pipe(
				mergeMap((config) =>
					disqusLoaded.pipe(
						filter((disqusLoaded) => !disqusLoaded),
						map(() => config)
					)
				),
				filter((config) => config && config.disqusSrc),
				take(1)
			)
			.subscribe((config) => {
				setDisqus(config)
					.pipe(take(1))
					.subscribe(() => {
						disqusLoaded.next(true);
					});
			});

		disqusLoaded.pipe(filter(Boolean), take(1)).subscribe(() => {
			resetDisqus(page);
		});
	});

	const handleRedirect = async (event) => {
		const resBlogs = await api('api/blogs', null, null, fetch);
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

	<Markdown
		type={'update'}
		title={$blog.title}
		source={$blog.content}
		id={$blog.id}
		on:redirectAction={handleRedirect}
	/>
{/if}

<div id="disqus_thread" />

<style>
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

	.date {
		text-align: right;
		margin-right: 0;
		margin-left: auto;
		display: block;
		color: var(--secondary-color);
	}
</style>
