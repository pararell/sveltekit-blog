<script>
	import { enhance } from '$lib/form';
	import { user } from '$lib/store';
	import { goto } from '$app/navigation';

	export let Email = '';
	export let Password = '';
	let error = '';
</script>

<form
	class="new"
	action={'/user/login.json'}
	method="post"
	use:enhance={{
		result: async (res, form) => {
			const created = await res.json();
			user.next(created);
			form.reset();
			goto('/blogs');
		}
	}}
>
	<header class="header">
		<h1 class="header-title">User login</h1>
		<div class="header-cta">
			<input type="text" name="Email" bind:value={Email} placeholder="Email" />
			<input type="password" name="Password" bind:value={Password} placeholder="Password" />
			<button class="btn submit" disabled={!Email}> Save</button>
		</div>
		{#if error}
			<p class="error">
				{error}
			</p>
		{/if}
	</header>
</form>
