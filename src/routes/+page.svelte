<script>
	import { page } from '$app/stores';
	import { api } from '$lib/api';
	import { pageModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { invalidate } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { preparePageForm } from '$lib/utils';

	let pageForm = Object.entries(pageModelForm);
	let id = null;

	let unsubscribe = page.subscribe((pageVal) => {
		if (pageVal.data.home) {
			const home = pageVal.data.home;
			id = home.id;
			pageForm = preparePageForm(pageForm, home);
		}
	});

	onDestroy(() => unsubscribe());

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
		{@html $page.data.home.content}
	</div>

	{#if $page.data?.user?.email === ADMIN_EMAIL}
		{#await import('$lib/FormWithMarkdown.svelte') then FormWithMarkdown}
			<div class="container">
				<FormWithMarkdown.default
					form={pageForm}
					content={$page.data.home.content}
					on:submitForm={submitForm}
				/>
			</div>
		{/await}
	{/if}
{/if}
