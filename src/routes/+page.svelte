<script>
	import { _ } from 'svelte-i18n';
	import { marked } from 'marked';
	import { user } from '$lib/store';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';
	import { api } from '$lib/api';
	import { pageModelForm, ADMIN_EMAIL } from '$lib/constants';

	let pageForm = Object.entries(pageModelForm);

	export let data;
	let {home} = data;

	$: {
		if (home) {
			const pageKeys = Object.keys(home);

			pageForm = pageForm.map((keyval) => {
				const found = pageKeys.includes(keyval[0]);
				if (found) {
					keyval[1].value = home[keyval[0]];
					return keyval;
				}

				return keyval;
			});
		}
	}

	const submitForm = async (event) => {
		const formData = event.detail;

		if (formData.title) {
			const data = {
				id: parseFloat(home.id),
				...formData,
				slug: formData.title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-')
			};

			const res = await api({ url: `api/pages/update`, method: 'PATCH', data });
			if (res) {
				home = res.body;
			}
		}
	};
</script>

<svelte:head>
	<title>{home ? home.metaTitle : $_('home')}</title>
</svelte:head>

{#if home}
	<div class="homePage">
		{@html marked(home.content)}
	</div>

	{#if $user?.email === ADMIN_EMAIL}
		<div class="container">
			<FormWithMarkdown form={pageForm} content={home.content} on:submitForm={submitForm} />
		</div>
	{/if}
{/if}
