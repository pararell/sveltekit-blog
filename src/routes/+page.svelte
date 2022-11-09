<script>
	import { marked } from 'marked';
	import { user } from '$lib/store';
	import { page } from '$app/stores';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';
	import { api } from '$lib/api';
	import { pageModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { invalidate } from '$app/navigation';

	let pageForm = Object.entries(pageModelForm);
  let id = null;

	page.subscribe(pageVal => {
		if (pageVal.data.home) {
			const home = pageVal.data.home;
			id = home.id;
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
	})

	const submitForm = async (event) => {
		const formData = event.detail;

		if (formData.title) {
			const data = {
				id: parseFloat(id),
				...formData,
				slug: formData.title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-')
			};

			const res = await api({ url: `api/pages/update`, method: 'PATCH', data });
			if (res) {
				invalidate('app:home');
			}
		}
	};
</script>

<svelte:head>
	<title>{$page.data?.home?.metaTitle}</title>
</svelte:head>

{#if $page.data.home}
	<div class="homePage">
		{@html marked($page.data.home.content)}
	</div>

	{#if $user?.email === ADMIN_EMAIL}
		<div class="container">
			<FormWithMarkdown form={pageForm} content={$page.data.home.content} on:submitForm={submitForm} />
		</div>
	{/if}
{/if}
