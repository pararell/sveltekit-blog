<script>
	import { blogs } from '$lib/store';
	import Blogs from '$lib/Blogs.svelte';
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<section>
	<div class="container">
		<h1>{$_('blog_title')}</h1>
		<h2>{$_('blog_subtitle')}</h2>

		<Blogs blogs="{$blogs}"/>
	</div>
</section>

<style>
	h1 {
		margin-bottom: 0;
	}
	h2 {
		text-align: center;
	}
</style>
