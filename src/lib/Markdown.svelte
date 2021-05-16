<script>
	import marked from 'marked';
	import { goto } from '$app/navigation';
	export let source = '# Subtitle';
	export let title = '';
	export let id = '';
	let error = '';
	let userEmail;
	export let type = 'create';
	$: markdown = marked(source);
	import { user, blog } from './store/store';
	import { filter } from 'rxjs/internal/operators/filter.js';
	import { take } from 'rxjs/internal/operators/take.js';
	import { enhance } from './form';

	user.pipe(filter(Boolean), take(1)).subscribe((user) => {
		userEmail = user && user.email ? user.email : '';
	});
</script>

{#if userEmail }
	<form
		class="new"
		action={'/blogs/' + type + '.json' + (type === 'update' ? '?_method=patch' : '')}
		method="post"
		use:enhance={{
			result: async (res, form) => {
				const created = await res.json();
				blog.next(created);
				if (type === 'create') {
					goto('/blogs');
                    form.reset();
				}
				if (type === 'update') {
					goto('/blogs/' + created.slug);
				}
			}
		}}
	>
		<header class="header">
			<h1 class="header-title">Add blog</h1>
			<div class="header-cta">
				<input type="text" name="title" bind:value={title} placeholder="Title" />
				<input type="hidden" name="author" value={userEmail} />
				<input type="hidden" name="id" value={id} />

				<button class="btn submit" disabled={!title || !source}> Save</button>
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
				<textarea name="content" bind:value={source} class="markdown-editor__source" />
			</div>
		</div>
	</form>
	{#if type === 'update'}
		<form
			action="/blogs/delete.json?_method=delete"
			method="post"
			use:enhance={{
				result: () => {
					goto('/blogs');
				}
			}}
		>
			<input type="hidden" name="id" value={id} />
			<button class="delete" aria-label="Delete todo"> Delete </button>
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
		flex-wrap: nowrap;
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
