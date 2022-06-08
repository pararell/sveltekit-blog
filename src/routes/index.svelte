<script>
	import { _ } from 'svelte-i18n';
	import { pages, user } from '$lib/store';
	import marked from 'marked';
	import Markdown from '$lib/Markdown.svelte';
	import { api } from '$lib/api';
	import { goto } from '$app/navigation';
	import { ADMIN_EMAIL } from '$lib/constants';

	let homePage;

	export let title = '';
	export let metaTitle = '';
	export let image = '';
	export let description = '';
	export let url = '';
	export let id = '';
	export let position = '';
	export let content = '';
	let error = '';

	pages.subscribe((ps) => {
		const home = ps.find((p) => p.url === '/');
		if (home) {
			homePage = home;
			title = home.title;
			metaTitle = home.metaTitle;
			image = home.image;
			description = home.description;
			url = home.url;
			id = home.id;
			position = home.position;
			content = home.content;
		}
	});

	const handleRedirect = async (event) => {
		const resPages = await api({ url: 'api/pages', serverFetch: fetch });

		if (resPages) {
			pages.next(resPages.body);
		}
	};

	const submitForm = async () => {
		if (title) {
			const data = {
				id: parseFloat(id),
				title,
				url,
				metaTitle,
				position,
				slug: title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-'),
				description,
				image,
				content
			};

			const res = await api({ url: `api/pages/update`, method: 'PATCH', data });
			handleRedirect();
			goto('/');
		}
	};
</script>

<svelte:head>
	<title>{homePage ? homePage.metaTitle : 'Home'}</title>
</svelte:head>


{#if homePage}
	<div class="homePage">
		{@html marked(homePage.content)}
	</div>
{/if}


{#if $user?.Email === ADMIN_EMAIL && homePage}
	<form on:submit|preventDefault={submitForm} class="new">
		<h1 class="header-title">Update Homepage</h1>
		<div class="header-cta">
			<input type="text" name="title" bind:value={title} placeholder="Title" />
			<input type="text" name="metaTitle" bind:value={metaTitle} placeholder="MetaTitle" />
			<input type="text" name="url" bind:value={url} placeholder="Url" />
			<input type="text" name="image" bind:value={image} placeholder="Image link" />
			<input type="number" name="position" bind:value={position} placeholder="Position" />
			<input type="text" name="description" bind:value={description} placeholder="Description" />
			<button class="btn submit" disabled={!title || !url || !content}> Save</button>
		</div>
		{#if error}
			<p class="error">
				{error}
			</p>
		{/if}

		<Markdown bind:content />
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
