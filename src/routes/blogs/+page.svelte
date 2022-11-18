<script>
	import Blogs from '$lib/Blogs.svelte';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

{#if $page.data?.blogs}
	<section>
		<div class="container">
			<h1>Blog</h1>

			<Blogs blogs={$page.data.blogs} />
		</div>
	</section>
{/if}

<style>
	h1 {
		margin-bottom: 0;
	}
</style>
