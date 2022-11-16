import { api } from '$lib/api';

export const load = async ({ fetch, url, params }) => {
	const resBlog = await api({ url: `api/blogs/${params.slug}`, serverFetch: fetch });

	if (resBlog) {
		return { url, params, blog: resBlog.body };
	}

	return {
		blog: null,
		url,
		params
	};
};
