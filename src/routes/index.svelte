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
		const home = ps.find((p) => p.slug === 'home');
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
	.homePage :global(.cv) {
		background-color: #ffffff;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='836' height='836' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='88' y1='88' x2='0' y2='0'%3E%3Cstop offset='0' stop-color='%23788081'/%3E%3Cstop offset='1' stop-color='%23cbd4d5'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='75' y1='76' x2='168' y2='160'%3E%3Cstop offset='0' stop-color='%23868686'/%3E%3Cstop offset='0.09' stop-color='%23ababab'/%3E%3Cstop offset='0.18' stop-color='%23c4c4c4'/%3E%3Cstop offset='0.31' stop-color='%23d7d7d7'/%3E%3Cstop offset='0.44' stop-color='%23e5e5e5'/%3E%3Cstop offset='0.59' stop-color='%23f1f1f1'/%3E%3Cstop offset='0.75' stop-color='%23f9f9f9'/%3E%3Cstop offset='1' stop-color='%23FFFFFF'/%3E%3C/linearGradient%3E%3Cfilter id='c' x='0' y='0' width='200%25' height='200%25'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='12' /%3E%3C/filter%3E%3C/defs%3E%3Cpolygon fill='url(%23a)' points='0 174 0 0 174 0'/%3E%3Cpath fill='%23000' fill-opacity='0' filter='url(%23c)' d='M121.8 174C59.2 153.1 0 174 0 174s63.5-73.8 87-94c24.4-20.9 87-80 87-80S107.9 104.4 121.8 174z'/%3E%3Cpath fill='url(%23b)' d='M142.7 142.7C59.2 142.7 0 174 0 174s42-66.3 74.9-99.3S174 0 174 0S142.7 62.6 142.7 142.7z'/%3E%3C/svg%3E");
		background-attachment: fixed;
		background-repeat: no-repeat;
		background-position: top left;
		display: flex;
		flex-flow: column;
		box-sizing: border-box;
		color: #13293d;
		font-family: Nunito, sans-serif;
		margin: 0;
		padding: 0;
	}

	.homePage :global(.icons) {
		position: fixed;
		right: 0;
		top: 20%;
		display: flex;
		flex-flow: column;
		width: 100px;
	}

	.homePage :global(.icons a:hover) {
		padding-right: 15px;
	}

	.homePage :global(.icons a) {
		transition: all 0.3s ease-in-out;
		margin: 10px 0 10px auto;
	}

	.homePage :global(.flex-in) {
		display: inline-flex;
		align-items: center;
	}

	.homePage :global(.basic-icon) {
		min-width: 40px;
		font-size: 2rem;
	}

	@keyframes change-text {
		0%,
		55%,
		100% {
			transform: translateY(-45%);
		}
		5%,
		50% {
			transform: translateY(-95%);
		}
	}
	@keyframes typing {
		0% {
			width: 0;
		}
	}
	@keyframes text-blink {
		50% {
			border-color: transparent;
		}
	}

	.homePage :global(a) {
		text-decoration: none;
		color: #13293d;
	}

	.homePage :global(a:hover) {
		color: #1b98e0;
	}

	.homePage :global(.wrapper) {
		margin: 2% 10%;
	}

	.homePage :global(.heading) {
		padding: 2%;
		text-align: center;
	}

	.homePage :global(.heading h2) {
		margin: 0 auto;
		font-family: 'Source Code Pro', monospace;
		font-size: 30px;
		font-weight: 500;
		animation: 8s typing steps(16, end), 0.5s text-blink step-end infinite;
		width: 9.6em;
		white-space: nowrap;
		overflow: hidden;
		border-right: 3px solid;
		color: #13293d;
	}
	@media screen and (max-width: 550px) {
		.homePage :global(.heading h2) {
			font-size: 30px;
		}
	}

	.homePage :global(.sm-name) {
		display: none;
		color: #13293d;
	}
	@media screen and (max-width: 550px) {
		.homePage :global(.sm-name) {
			display: block;
		}
	}

	.homePage :global(.name) {
		height: 50px;
		overflow: hidden;
		font-weight: bold;
	}
	@media screen and (max-width: 550px) {
		.homePage :global(.name) {
			display: none;
		}
	}
	.homePage :global(.name h1) {
		list-style: none;
		padding: 0;
		color: #13293d;
		animation: 8s change-text linear infinite;
		margin: 3rem 0;
	}
	.homePage :global(.name h1 span) {
		line-height: 1.2;
		color: #13293d;
		font-size: 40px;
	}

	.homePage :global(.block h2) {
		font-family: 'Source Code Pro', monospace;
		border-bottom: 2px solid;
		font-weight: bold;
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
	}

	.homePage :global(.block h3) {
		font-size: 1rem;
		line-height: 1.2;
		font-weight: bold;
		margin: 0;
	}
	.homePage :global(.block ul) {
		list-style: none;
		padding-left: 0;
		margin: 0;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.homePage :global(.pri-tag) {
		display: inline-block;
		padding: 8px;
		background: #13293d;
		color: #fff;
	}

	.homePage :global(.sec-tag) {
		display: inline-block;
		padding: 8px;
		background: #e8f1f2;
		color: #13293d;
	}

	.homePage :global(.about p::before) {
		content: '    ';
	}

	.homePage :global(.profile) {
		background-size: 100%;
		border-radius: 50%;
		margin: 20px auto;
		width: 100px;
		height: 100px;
		display: inline-block;
		background-image: url('http://api.miroslavsmrtic.sk/uploads/foto_bfe1c715ec.png');
	}

	.homePage :global(.icon-size) {
		font-size: 2rem;
	}

	.homePage :global(.block li) {
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.4s ease;
		min-height: 80px;
		min-width: 80px;
		margin: 5px 15px 5px 0px;
		border-radius: 5px;
	}

	.homePage :global(.title) {
		display: none;
		transition: all 0.4s ease;
	}

	.homePage :global(.block li:hover) {
		transform: scale(1.2);
	}

	.homePage :global(.block li:hover .title) {
		display: inline-flex;
	}

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
