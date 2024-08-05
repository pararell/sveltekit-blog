<script>
	import { api } from '$lib/api';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { pageModelForm } from '$lib/constants';
	import { locale } from '$lib/i18n';
	import { prepareSlug } from '$lib/utils';
	import { onDestroy } from 'svelte';

	let pageForm = Object.entries(pageModelForm);
	let { authorization = $bindable({}) } = $props();

	let unsubscribe = page.subscribe((pageVal) => {
		authorization = pageVal.data?.token ? { authorization: pageVal.data.token } : {};
	});

	const handleRedirect = async () => {
		invalidateAll().then(() => {
			goto('/');
		});
	};

	const submitForm = async (formData) => {
		if (formData.title) {
			const data = {
				...formData,
				slug: prepareSlug(formData.title),
				lang: $locale
			};

			const res = await api({ url: `api/v1/pages/create`, method: 'POST', data, authorization });

			if (res) {
				handleRedirect();
			}
		}
	};


	onDestroy(() => unsubscribe());
</script>

<div class="page">
	{#if $page.data?.user?.isAdmin}
		{#await import('$lib/FormWithMarkdown.svelte') then FormWithMarkdown}
			<div class="container">
				<FormWithMarkdown.default form={pageForm} submitForm={submitForm} />
			</div>
		{/await}
	{/if}
</div>

<style>
	.page {
		padding-top: 40px;
	}
</style>
