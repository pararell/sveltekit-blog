<script>
	let subject = '',
		note = '',
		email = '',
		result = '';
	import { api } from '$lib/api';
	import { t } from '$lib/i18n';

	async function handleSubmit() {
		const data = {
			subject,
			note,
			email
		};

		let response = await api({ url: `api/contact`, method: 'POST', data });

		if (response) {
			result = response.body;
			(subject = ''), (note = ''), (email = '');
		}
	}
</script>

<div class="flex">
	<div class="col">
		<form class="content" on:submit|preventDefault={handleSubmit}>
			<span class="field">
				<label for="subject">{$t('subject')}</label>
				<input id="subject" name="subject" type="text" bind:value={subject} />
			</span>
			<span class="field">
				<label for="email">Email</label>
				<input id="email" name="email" type="text" bind:value={email} />
			</span>
			<span class="field">
				<label for="note">{$t('note')}</label>
				<textarea id="note" name="note" bind:value={note} />
			</span>
			<button disabled={!email || !note || !subject} type="submit" class="btn">{$t('send')}</button>
		</form>
		{#if result}
			<span class="result">
				{$t(result.message)}
			</span>
		{/if}
	</div>
</div>

<style>
	.content {
		display: flex;
		flex-flow: column;
		color: var(--text-color);
		padding: 20px;
		border-radius: 4px;
		z-index: 2;
		position: relative;
	}
	.field {
		display: flex;
		align-items: center;
		width: 100%;
		margin-bottom: 20px;
	}

	.field label {
		min-width: 20%;
		margin-left: 10px;
	}

	.field input,
	.field textarea {
		width: 100%;
		border-radius: 4px;
		min-height: 50px;
		padding: 0 10px;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
		border: 1px solid transparent;
		outline: none;
	}
	.field input:focus,
	.field textarea:focus {
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.field textarea {
		min-height: 200px;
		padding: 10px;
	}

	.result {
		text-align: center;
		display: block;
		text-transform: uppercase;
		padding: 10px 0;
    font-weight: bold;
	}

	.flex {
		display: flex;
		flex-flow: column;
		flex-wrap: nowrap;
	}
</style>
