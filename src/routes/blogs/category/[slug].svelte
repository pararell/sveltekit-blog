<script>
	import Blogs from '$lib/Blogs.svelte';
	import { page } from '$app/stores';
	import { blogs } from '$lib/store';
</script>

<svelte:head>
	<title>{$page?.params?.slug}</title>
</svelte:head>

<section>
	<h2>{$page?.params?.slug}</h2>
	<Blogs category={$page?.params?.slug} blogs={$blogs} />
</section>

<style>
	h2 {
		text-align: center;
		text-transform: uppercase;
	}
</style>
