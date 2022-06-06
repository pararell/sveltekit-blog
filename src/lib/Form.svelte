<script>
	import { inputTypes } from './constants';
	import { Button, TextField, RadioGroup, CheckboxGroup } from 'attractions';
	import { createEventDispatcher } from 'svelte';

	export let form;
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

<form class="form" on:submit|preventDefault={handleSubmit}>
	{#if form}
		{#each form as [name, item]}
			{#if inputTypes.includes(item.type)}
				<span class="field">
					<label class="label" for={name}>{name}</label>
					<TextField {name} placeholder={name} type={item.type} bind:value={item.value} />
				</span>
				<br />
			{/if}
			{#if item.type === 'textarea'}
				<span class="field">
					<label class="label" for={name}>{name}</label>
					<TextField {name} placeholder={name} type="text" multiline="true" bind:value={item.value} />
				</span>
			{/if}
			{#if item.type === 'radio'}
				<label class="label" for={name}>{name}</label>
				<br />

				<span class="field">
					<RadioGroup class="radio-group" items={item.items} bind:value={item.value} />
				</span>
			{/if}
			{#if item.type === 'checkbox'}
				<label class="label" for={name}>{name}</label>
				<br />

				<span class="field">
					<CheckboxGroup class="checkbox-group" items={item.items} bind:value={item.value} />
				</span>
			{/if}
		{/each}
	{/if}
	<Button filled type="submit">Submit</Button>
</form>

<style>
	.label {
		text-transform: capitalize;
	}

	.form {
		margin-bottom: 24px;
	}

	:global(.radio-group),
	:global(.checkbox-group) {
		display: flex;
		padding: 15px 0;
	}
</style>
