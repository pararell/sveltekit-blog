<script>
	import { enhance } from '$lib/form';
	import { goto } from '$app/navigation';

	export let Email = '';
	export let Username = '';
	export let Password = '';
	let error = '';
</script>

<form
	class="new"
	action={'/user/register.json'}
	method="post"
	use:enhance={{
		result: async (res, form) => {
			goto('/user/login');

			form.reset();
		}
	}}
>
	<header class="header">
		<h1 class="header-title">User register</h1>
		<div class="header-cta">
			<input type="text" name="Email" bind:value={Email} placeholder="Email" />
			<input type="text" name="Username" bind:value={Username} placeholder="Username" />
			<input type="password" name="Password" bind:value={Password} placeholder="Password" />
			<button class="btn submit" disabled={!Email || !Username}> Save</button>
		</div>
		{#if error}
			<p class="error">
				{error}
			</p>
		{/if}
	</header>
</form>
