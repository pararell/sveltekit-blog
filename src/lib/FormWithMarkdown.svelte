<script>
	import Markdown from '$lib/Markdown.svelte';
	import { inputTypes } from './constants';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { form = $bindable(), content = '', submitForm } = $props();
	let editor = $state();
	let error = '';
	let showMarkdown = $state(false);
	let showEditor = $state(false);

	$effect.pre(() => {
		if (editor) {
			editor.value = content;
		}
	});

	onMount(async () => {
		try {
			await import('https://cdnjs.cloudflare.com/ajax/libs/jodit/3.24.7/jodit.es2018.min.js');

			if (Jodit) {
				editor = Jodit.make('#editor', {
					spellcheck: true,
					defaultMode: '2',
					enter: 'DIV'
				});

				if (content) {
					editor.value = content;
				}
			}
		} catch (e) {
			console.log(`Jodit editor wasn't loaded - ${e}`);
		}
	});

	const prettifyHTML = async () => {
		if (content) {
			const { default: prettier } = await import(
				'https://unpkg.com/prettier@2.7.1/esm/standalone.mjs'
			);
			const { default: parserHTML } = await import(
				'https://unpkg.com/prettier@2.7.1/esm/parser-html.mjs'
			);
			const prettifyContent = prettier.format(content, {
				parser: 'html',
				plugins: [parserHTML]
			});
			if (editor) {
				editor.value = prettifyContent;
			}
		}
	};

	const handleSubmit = () => {
		submitForm({
			...form.reduce((prev, curr) => {
				const name = curr[0];
				const item = curr[1];

				return {
					...prev,
					[name]: item.value
				};
			}, {})
		});
	};

	const saveWithEditor = () => {
		form = form.map((keyval) => {
			if (keyval[0] === 'content') {
				keyval[1].value = editor.value;
				return keyval;
			}

			return keyval;
		});

		handleSubmit();
	};
</script>

{#if $page.data?.user?.email}
	<form class="form" onsubmit={(event) => {
		event.preventDefault();

		handleSubmit?.(event);
}}>
		{#if form}
			{#each form as [name, item]}
				{#if inputTypes.includes(item.type)}
					<span class="field">
						<label class="label" for={name}>{name}</label>
						{#if item.type === 'text'}
							<input type="text" {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'email'}
							<input type="email" {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'password'}
							<input type="password" {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'tel'}
							<input type="tel" {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'date'}
							<input type="date" {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'number'}
							<input type="number" {name} bind:value={item.value} placeholder={name} />
						{/if}
					</span>
				{/if}
				{#if item.type === 'textarea'}
					<span class="field">
						<label class="label" for={name}>{name}</label>
						<textarea {name} id="" cols="30" rows="10" bind:value={item.value} placeholder={name} ></textarea>
					</span>
				{/if}
				{#if item.type === 'markdown'}
					<button class="btn" type="button" onclick={() => (showMarkdown = !showMarkdown)}>
						Markdown toggle</button
					>
					<div class:hidden={showMarkdown === false}>
						<Markdown bind:content={item.value} />
					</div>
				{/if}
			{/each}
		{/if}

		{#if error}
			<p class="error">
				{error}
			</p>
		{/if}
		<button class="btn submit" type="submit"> Save</button>
	</form>

	<button class="btn" type="button" onclick={(event) => {
		event.preventDefault();
		showEditor = !showEditor
	}}>
		Editor toggle</button
	>
	<div class:hidden={showEditor === false}>
		<textarea id="editor" ></textarea>
	</div>
	<button class="btn submit" onclick={saveWithEditor}> Save with editor</button>

	<button class="btn" type="button" onclick={prettifyHTML}> Prettify HTML</button>
{/if}

<style>
	@import 'https://cdnjs.cloudflare.com/ajax/libs/jodit/3.24.7/jodit.min.css';

	.field {
		max-width: 400px;
		margin: 10px auto;
		display: flex;
		flex-flow: column;
	}

	.label {
		text-transform: capitalize;
		color: var(--text-color);
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

	.btn {
		display: block;
		margin: 25px auto;
		max-width: 500px;
	}

	.hidden {
		display: none;
	}
</style>
