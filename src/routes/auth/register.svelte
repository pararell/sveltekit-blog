<script>
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';

	let Email = '';
	let Username = '';
	let Password = '';
	let error = '';

	const submitForm = async () => {
		const data = {
			Email,
			Password,
			Username
		};
		try {
			const res = await api({ url: `api/register`, method: 'POST', data });
			if (res && res.status === 400) {
				error = res.body;
				return;
			}
			goto('/auth/login');
		} catch (e) {
			error = e;
		}
	};
</script>

<div class="container">
	<form on:submit|preventDefault={() => submitForm()} class="form">
		<h1 class="header-title">User register</h1>
		<div class="form">
			<span class="field">
				<label class="label" for="Email">Email</label>
				<input type="email" name="Email" bind:value={Email} placeholder="Email" />
			</span>
			<span class="field">
				<label class="label" for="Username">Username</label>
				<input type="text" name="Username" bind:value={Username} placeholder="Username" />
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
