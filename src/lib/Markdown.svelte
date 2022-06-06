<script>
	import marked from 'marked';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { user, blog } from './store';
	import { _, locale } from 'svelte-i18n';
	import { api } from '$lib/api';
import { ADMIN_EMAIL } from './constants';

	const dispatch = createEventDispatcher();
	export let content = '# Subtitle';
	export let title = '';
	export let imgLink = '';
	export let description = '';
	export let categories = '';
	export let id = '';
	export let date = new Date().toISOString().substr(0, 10);
	export let type = 'create';
	let error = '';
	$: markdown = marked(content);

	const submitForm = async (method) => {
		if (method === 'POST' && title) {
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
			const res = await api({ url: `api/blogs/create`, method, data });
			blog.next(res.body);
			dispatch('redirectAction', {
				text: 'blogs'
			});

			if (type === 'create') {
				goto('/blogs');
			}
		}

		if (method === 'PATCH' && id && title) {
			const data = {
				id: parseFloat(id),
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
			const res = await api({ url: `api/blogs/update`, method, data });
			blog.next(res.body);

			dispatch('redirectAction', {
				text: 'blogs'
			});

			goto('/blogs/' + res.body.slug);
		}

		if (method === 'DELETE' && id) {
			const res = await api({ url: `api/blogs/delete/` + id, method });

			if (res) {
				dispatch('redirectAction', {
					text: 'blogs'
				});
				goto('/blogs');
			}
		}
	};
</script>

{#if $user?.Email === ADMIN_EMAIL}
	<form
		on:submit|preventDefault={() => submitForm(type === 'update' ? 'PATCH' : 'POST')}
		class="new"
	>
		<header class="header">
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
		</header>

		<div class="markdown-editor">
			<div class="markdown-editor__right-panel">
				<div class="markdown-editor__output">{@html markdown}</div>
			</div>
			<div class="markdown-editor__left-panel">
				<textarea name="content" bind:value={content} class="markdown-editor__source" />
			</div>
		</div>
	</form>
	{#if type === 'update'}
		<form on:submit|preventDefault={() => submitForm('DELETE')}>
			<input type="hidden" name="id" value={id} />
			<button class="btn delete" aria-label="Delete blog"> Delete Blog</button>
		</form>
	{/if}
{/if}

<style>
	.header {
		padding: 10px 0;
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

	.markdown-editor {
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-evenly;
	}

	.markdown-editor__left-panel,
	.markdown-editor__right-panel {
		width: 50%;
		box-shadow: 0px 0px 4px #ccc;
		border: 1px solid rgba(0, 0, 0, 0.1);
		height: 85vh;
	}

	.markdown-editor__right-panel {
		overflow: auto;
	}

	.markdown-editor__source {
		border: none;
		width: 100%;
		height: 99%;
	}

	.markdown-editor__source:focus {
		outline: none;
	}

	.markdown-editor__output {
		width: 100%;
		padding: 0 2em;
	}
</style>
