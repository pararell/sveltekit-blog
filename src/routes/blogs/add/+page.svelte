<script>
	import { api } from '$lib/api';
	import { goto, invalidateAll } from '$app/navigation';
	import { blogModelForm } from '$lib/constants';
	import { locale } from '$lib/i18n';
	import { page } from '$app/stores';
	import { prepareSlug } from '$lib/utils.js';
	import { onDestroy } from 'svelte';

	let blogForm = Object.entries(blogModelForm);
	export let data;
	export let authorization = {};
	const { user } = data;


	let unsubscribe = page.subscribe((pageVal) => {
	  authorization = pageVal.data?.token ? { authorization: pageVal.data.token } : {};
	});

	const handleRedirect = async () => {
		invalidateAll().then(() => {
			goto('/blogs');
		});
	};

	const submitForm = async (event) => {
		const formData = event.detail;
		if (formData.title) {
			const data = {
				...formData,
				slug: prepareSlug(formData.title),
				categories: formData.categories ? formData.categories.split(',') : [],
				author: user.email,
				lang: $locale,
				comments: []
			};

			const res = await api({ url: `api/v1/blogs/create`, method: 'POST', data, authorization });
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
				<FormWithMarkdown.default form={blogForm} on:submitForm={submitForm} />
			</div>
		{/await}
	{/if}
</div>

<style>
	.page {
		padding-top: 40px;
	}
</style>
