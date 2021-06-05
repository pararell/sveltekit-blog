<script>
	import Blog from '$lib/Blog.svelte';
    import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page?.params?.slug}</title>
</svelte:head>

<section>
	<h2>{$page?.params?.slug}</h2>
	<Blog category={$page?.params?.slug} />
</section>

<style>
	h2 {
		text-align: center;
        text-transform: uppercase;
	}
</style>
