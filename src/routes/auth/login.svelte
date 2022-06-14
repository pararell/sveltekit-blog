<script>
	import { api } from '$lib/api';
	import { user } from '$lib/store';
	import { goto } from '$app/navigation';

	let Email = '';
	let Password = '';
	let error = '';

	const submitForm = async () => {
		const data = {
			Email,
			Password
		};
		const res = await api({ url: `api/login`, method: 'POST', data });
		if (res && res.status === 400) {
				error = res.body;
				return;
			}
		user.next(res.body);
		goto('/blogs');
	};
</script>

<div class="container">
	<form on:submit|preventDefault={() => submitForm()} class="form">
		<h1 class="header-title">User login</h1>
		<div class="form">
			<span class="field">
				<label class="label" for="Email">Email</label>
				<input type="email" name="Email" bind:value={Email} placeholder="Email" />
			</span>
			<span class="field">
				<label class="label" for="Password">Password</label>
				<input type="password" name="Password" bind:value={Password} placeholder="Password" />
			</span>
			<button class="btn submit" disabled={!Email}> Submit</button>
		</div>
		{#if error}
			<p class="error">
				{error}
			</p>
		{/if}
	</form>
</div>

<style>
	.form {
		max-width: 400px;
		margin: auto;
	}

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
</style>
