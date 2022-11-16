<script>
	import Blogs from '$lib/Blogs.svelte';
	import { t } from '$lib/translations';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

{#if $page.data?.blogs}
	<section>
		<div class="container">
			<h1>{$t('common.blog_title')}</h1>
			<h2>{$t('common.blog_subtitle')}</h2>

			<Blogs blogs={$page.data.blogs} />
		</div>
	</section>
{/if}

<style>
	h1 {
		margin-bottom: 0;
	}
	h2 {
		text-align: center;
	}
</style>
