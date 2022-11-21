<script>
	import { api } from '$lib/api';
	import { goto, invalidateAll } from '$app/navigation';
	import { blogModelForm } from '$lib/constants';
	import { locale } from '$lib/i18n';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';

	let blogForm = Object.entries(blogModelForm);
	export let data;
	const { user } = data;

	const handleRedirect = async () => {
		invalidateAll().then(() => {
			goto('/blogs');
		})
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
				categories: formData.categories ? formData.categories.split(',') : [],
				author: user.email,
				lang: $locale,
				comments: []
			};

			const res = await api({ url: `api/blogs/create`, method: 'POST', data });
			if (res) {
				handleRedirect();
			}

		}
	};
</script>

<div class="page">
	<div class="container">
		<FormWithMarkdown form={blogForm} on:submitForm={submitForm} />
	</div>
</div>

<style>
	.page {
		padding-top: 40px;
	}
</style>
