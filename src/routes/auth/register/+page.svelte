<script>
	let email = $state('');
	let username = $state('');
	let password = $state('');
	let { form } = $props();
</script>

<div class="container">
	<form class="form" method="POST" action="?/register">
		<h1 class="header-title">User register</h1>
		<div class="form">
			<span class="field">
				<label class="label" for="email">Email</label>
				<input type="email" name="email" bind:value={email} placeholder="Email" />
			</span>
			<span class="field">
				<label class="label" for="username">Username</label>
				<input type="text" name="username" bind:value={username} placeholder="Username" />
			</span>
			<span class="field">
				<label class="label" for="password">Password</label>
				<input type="password" name="password" bind:value={password} placeholder="Password" />
			</span>
			<button class="btn submit" disabled={!email}> Submit</button>
		</div>
		{#if form?.error}
			<p class="error">
				{form.error}
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
