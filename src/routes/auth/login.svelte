<script>
	import { api } from '$lib/api';
	import { user } from '$lib/store';
	import { goto } from '$app/navigation';
	import { Button, TextField } from 'attractions';

	export let Email = '';
	export let Password = '';
	let error = '';

	const submitForm = async () => {
			const data = {
				Email,
				Password
			};
			const res = await api({ url: `api/login`, method: 'POST', data });
			user.next(res.body);
			goto('/blogs');
	};
</script>

<form on:submit|preventDefault={() => submitForm()}
	class="new"
>
	<h1 class="header-title">User login</h1>
	<div class="form">
		<span class="field">
			<label class="label" for="Email">Email</label>
			<TextField name={'Email'} placeholder="Email" type="email" bind:value={Email} />
		</span>
		<span class="field">
			<label class="label" for="Password">Password</label>
			<TextField name={'Password'} placeholder="password" type="password" bind:value={Password} />
		</span>
		<Button class="submit-btn" filled type="submit" disabled={!Email}>Submit</Button>
	</div>
	{#if error}
		<p class="error">
			{error}
		</p>
	{/if}
</form>

<style>
	.form :global(.submit-btn)  {
		margin-top: 20px;
	}
</style>
