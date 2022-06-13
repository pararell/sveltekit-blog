<script context="module">
	import { api } from '$lib/api';
	import { blogs } from '$lib/store';

	export const load = async ({ fetch }) => {
		const resBlogs = await api({ url: 'api/blogs', serverFetch: fetch });

		if (resBlogs) {
			blogs.next(resBlogs.body);

			return {
				props: {},
				cache: {
					maxage: 0
				}
			};
		}

		return {
			error: new Error()
		};
	};

</script>

<script>
	import Blogs from '$lib/Blogs.svelte';
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

{#if $blogs}
<section>
	<div class="container">
		<h1>{$_('blog_title')}</h1>
		<h2>{$_('blog_subtitle')}</h2>

		<Blogs blogs={$blogs} />
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
