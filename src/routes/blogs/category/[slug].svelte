<script>
	import Blogs from '$lib/Blogs.svelte';
	import { page } from '$app/stores';
	import { blogs } from '$lib/store';
</script>

<svelte:head>
	<title>{$page?.params?.slug}</title>
</svelte:head>

<section>
	<div class="container">
	<h1>{$page?.params?.slug}</h1>
	<Blogs category={$page?.params?.slug} blogs={$blogs} />
</div>
</section>

<style>
	h1 {
		text-align: center;
		text-transform: uppercase;
	}
</style>
