<script>
	import { api } from '$lib/api';
	import { pages } from '$lib/store';
	import { goto } from '$app/navigation';
	import { pageModelForm } from '$lib/constants';
	import { locale } from 'svelte-i18n';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';

	let pageForm = Object.entries(pageModelForm);

	const handleRedirect = async (event) => {
		const resPages = await api({ url: 'api/pages', serverFetch: fetch });

		if (resPages) {
			pages.next(resPages.body);
		}
	};

	const submitForm = async (event) => {
		const formData = event.detail;
		if (formData.title) {
			const data = {
				...formData,
				slug: formData.title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-'),
				lang: $locale
			};

			const res = await api({ url: `api/pages/create`, method: 'POST', data });

			if (res) {
				handleRedirect();
				goto('/');
			}
		}
	};
</script>

<div class="page">
	<div class="container">
		<FormWithMarkdown form={pageForm} on:submitForm={submitForm} />
	</div>
</div>

<style>
 .page {
	 padding-top: 40px;
 }
</style>
