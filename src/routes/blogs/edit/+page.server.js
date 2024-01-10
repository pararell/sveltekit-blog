export const prerender = false;
import { api } from '$lib/api';

export const load = async ({ fetch, params, url, locals }) => {
	const authorization = locals.token ? { authorization: locals.token } : {};
	const loadBlog = async () => {
		let blogQuery = url.searchParams.get('edit');
		const resBlog = await api({
			url: `api/v1/blogs/${blogQuery}`,
			serverFetch: fetch,
			authorization
		});

		return resBlog.body;
	};

	return {
		blog: await loadBlog(),
		host: url.host,
		params
	};
};
