<script>
	import { ADMIN_EMAIL } from '$lib/constants';
	import Markdown from '$lib/Markdown.svelte';
	import { inputTypes } from './constants';
	import { createEventDispatcher } from 'svelte';
	import { user } from './store';

	export let form;
	let error = '';

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
</script>

{#if $user?.Email === ADMIN_EMAIL}
	<form class="form" on:submit|preventDefault={handleSubmit}>
		{#if form}
			{#each form as [name, item]}
				{#if inputTypes.includes(item.type)}
					<span class="field">
						<label class="label" for={name}>{name}</label>
						{#if item.type === 'text'}
						<input type='text' {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'email'}
						<input type='email' {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'password'}
						<input type='password' {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'tel'}
						<input type='tel' {name} bind:value={item.value} placeholder={name} />
						{/if}
						{#if item.type === 'date'}
						<input type='date' {name} bind:value={item.value} placeholder={name} />
						{/if}
					</span>
				{/if}
				{#if item.type === 'textarea'}
					<span class="field">
						<label class="label" for={name}>{name}</label>
						<textarea {name}  id="" cols="30" rows="10" bind:value={item.value} placeholder={name}></textarea>
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
{/if}

<style>
	.field {
		max-width: 400px;
		margin: 10px auto;
		display: flex;
		flex-flow:column;
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
</style>
