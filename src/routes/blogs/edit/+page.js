export const prerender = false;
import { api } from '$lib/api';

export const load = async ({ fetch, params, url }) => {
	const loadBlog = async () => {
		let blogQuery = url.searchParams.get('edit');
		const resBlog = await api({ url: `api/blogs/${blogQuery}`, serverFetch: fetch });

		return resBlog.body;
	};

	return {
		blog: loadBlog(),
		host: url.host,
		params
	};
};
