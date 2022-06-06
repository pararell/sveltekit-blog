<script>
	import { enhance } from '$lib/form';
	import { goto } from '$app/navigation';
	import { Button, TextField } from 'attractions';

	export let Email = '';
	export let Username = '';
	export let Password = '';
	let error = '';
</script>

<form
	class="new"
	action={'/auth/register.json'}
	method="post"
	use:enhance={{
		result: async (res, form) => {
			goto('/auth/login');

			form.reset();
		}
	}}
>


<h1 class="header-title">User register</h1>
<div class="form">
	<span class="field">
		<label class="label" for="Email">Email</label>
		<TextField name={'Email'} placeholder="Email" type="email" bind:value={Email} />
	</span>
	<span class="field">
		<label class="label" for="Username">Username</label>
		<TextField name={'Username'} placeholder="Username" type="text" bind:value={Username} />
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