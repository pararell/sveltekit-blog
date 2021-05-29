<script>
	import Blog from '$lib/Blog.svelte';
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<section>
	<h1>{$_('blog_title')}</h1>
	<h2>{$_('blog_subtitle')}</h2>

	<Blog />
</section>

<style>
	h1 {
		margin-bottom: 0;
	}
	h2 {
		text-align: center;
	}
</style>
