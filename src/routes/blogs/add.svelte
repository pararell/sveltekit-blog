<script>
	import { api } from '$lib/api';
	import { blogs, blog, user } from '$lib/store';
	import { goto } from '$app/navigation';
	import { blogModelForm } from '$lib/constants';
  import { locale } from '$lib/translations';
	import FormWithMarkdown from '$lib/FormWithMarkdown.svelte';

	let blogForm = Object.entries(blogModelForm);

	const handleRedirect = async () => {
		const resBlogs = await api({ url: 'api/blogs', serverFetch: fetch });

		if (resBlogs) {
			blogs.next(resBlogs.body);
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
				categories: formData.categories ? formData.categories.split(',') : [],
				author: user.value.email,
				lang: $locale,
				comments: []
			};

			const res = await api({ url: `api/blogs/create`, method: 'POST', data });
			blog.next(res.body);
			handleRedirect();
			goto('/blogs');
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
