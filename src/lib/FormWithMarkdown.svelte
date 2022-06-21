<script>
	import { ADMIN_EMAIL } from '$lib/constants';
	import Markdown from '$lib/Markdown.svelte';
	import { inputTypes } from './constants';
	import { createEventDispatcher, onMount } from 'svelte';
	import { user } from './store';

	export let form;
	export let content = '';
	let editor;
	let error = '';

	$: {
		if (editor) {
			editor.value = content;
		}
	}

	onMount(async () => {
		try {
			await import('https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.9/jodit.es2018.min.js');

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

	const dispatch = createEventDispatcher();

	const handleSubmit = () => {
		dispatch('submitForm', {
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

{#if $user?.email === ADMIN_EMAIL}
	<form class="form" on:submit|preventDefault={handleSubmit}>
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
						<textarea {name} id="" cols="30" rows="10" bind:value={item.value} placeholder={name} />
					</span>
				{/if}
				{#if item.type === 'markdown'}
					<Markdown bind:content={item.value} />
				{/if}
			{/each}
		{/if}

		{#if error}
			<p class="error">
				{error}
			</p>
		{/if}
		<button class="btn submit"> Save</button>
	</form>

	<textarea id="editor" />
	<button class="btn submit" on:click={saveWithEditor}> Save with editor</button>
{/if}

<style>
	@import 'https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.9/jodit.es2018.min.css';

	.field {
		max-width: 400px;
		margin: 10px auto;
		display: flex;
		flex-flow: column;
	}

	.label {
		text-transform: capitalize;
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
</style>
