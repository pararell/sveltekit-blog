export const prerender = false;
import { api } from '$lib/api';

export const load = async ({ fetch, params, url }) => {
	const loadBlog = async () => {
		let blogQuery = url.searchParams.get('edit');
		const resBlog = await api({ url: `api/v1/blogs/${blogQuery}`, serverFetch: fetch });

		return resBlog.body;
	};

	return {
		blog: await loadBlog(),
		host: url.host,
		params
	};
};
