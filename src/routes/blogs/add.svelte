<script>
	import Markdown from '$lib/Markdown.svelte';
	import { api } from '$lib/api';
	import { blogs, blog, user } from '$lib/store';
	import { goto } from '$app/navigation';
	import { ADMIN_EMAIL } from '$lib/constants';
	import { _, locale } from 'svelte-i18n';

	export let title = '';
	export let imgLink = '';
	export let description = '';
	export let categories = '';
	export let id = '';
	export let date = new Date().toISOString().substr(0, 10);
	export let content = '#Title';
	let error = '';

	

	const handleRedirect = async (event) => {
		const resBlogs = await api({ url: 'api/blogs', serverFetch: fetch });

		if (resBlogs) {
			blogs.next(resBlogs.body);
		}
	};

	const submitForm = async () => {
		if (title) {
			const data = {
				title,
				slug: title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-'),
				description,
				imgLink,
				content,
				categories: categories ? categories.split(',') : [],
				date,
				author: user.value.Email,
				lang: $locale,
				comments: []
			};

			const res = await api({ url: `api/blogs/create`, method: 'POST', data });
			blog.next(res.body);
			handleRedirect();
			goto('/blogs');
		}
	};
</script>

{#if $user?.Email === ADMIN_EMAIL}
	<form on:submit|preventDefault={submitForm} class="new">
		<h1 class="header-title">Add blog</h1>
		<div class="header-cta">
			<input type="text" name="title" bind:value={title} placeholder="Title" />
			<input type="text" name="imgLink" bind:value={imgLink} placeholder="Image link" />
			<input type="text" name="description" bind:value={description} placeholder="Description" />
			<input type="text" name="categories" bind:value={categories} placeholder="Categories" />
			<input type="date" name="date" bind:value={date} placeholder="Date" />
			<input type="hidden" name="author" value={$user.Email} />
			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="lang" value={$locale} />
			<button class="btn submit" disabled={!title || !content}> Save</button>
		</div>
		{#if error}
			<p class="error">
				{error}
			</p>
		{/if}

		<Markdown bind:content={content}  />
	</form>
{/if}


<style>
	.header-title {
		margin: 0 0 10px 0;
		text-align: center;
	}

	.header-cta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
		position: relative;
	}

	input {
		min-width: 50%;
		border-radius: 4px;
		padding: 0 10px;
		box-shadow: 0px 0px 4px #ccc;
		border: 1px solid transparent;
		min-height: 35px;
		outline: none;
		margin-right: 15px;
	}
</style>