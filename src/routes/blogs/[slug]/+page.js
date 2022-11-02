import { blog } from '$lib/store';
import { api } from '$lib/api';

export const load = async ({ fetch, url, params }) => {
	const resBlog = await api({ url: `api/blogs/${params.slug}`, serverFetch: fetch });

	if (resBlog) {
		blog.next(resBlog.body);
		return { url, params };
	}

	return {
		url,
		params
	};
};
