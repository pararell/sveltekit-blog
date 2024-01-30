<script>
	import Comments from '$lib/Comments.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
</script>

<svelte:head>
	<title>{$page.data?.blog?.title}</title>
</svelte:head>

{#if $page.data?.blog}
	<div class="container">
		<h1>{$page.data?.blog.title}</h1>

		<div class="content">
			{@html $page.data?.blog.content}
		</div>

		<span class="date">{new Date($page.data?.blog.date).toLocaleDateString()}</span>

		{#if browser}
			<Comments host={$page.data?.host} slug={$page.data?.paramsBlog} disqusUrl={$page.data?.pageEnv?.DISQUSSRC} />
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
</style>
