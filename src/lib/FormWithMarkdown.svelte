<script>
	import { ADMIN_EMAIL } from '$lib/constants';
	import Markdown from '$lib/Markdown.svelte';
	import { inputTypes } from './constants';
	import { createEventDispatcher } from 'svelte';
	import { Button, TextField, RadioGroup, CheckboxGroup } from 'attractions';
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
						<TextField {name} placeholder={name} type={item.type} bind:value={item.value} />
					</span>
				{/if}
				{#if item.type === 'textarea'}
					<span class="field">
						<label class="label" for={name}>{name}</label>
						<TextField
							{name}
							placeholder={name}
							type="text"
							multiline="true"
							bind:value={item.value}
						/>
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
		<Button filled type="submit">Submit</Button>
	</form>
{/if}

<style>
  .field {
    max-width: 400px;
    display: block;
    margin: 10px auto;
  }

  .label {
    text-transform: capitalize;
  }

  .form :global(.btn) {
    display: block;
    border-radius: 6px;
    max-width: 300px;
    margin: 20px auto;
  }
</style>


