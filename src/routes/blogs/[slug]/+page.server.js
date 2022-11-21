import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {
	const loadBlog = async () => {
		const resBlog = await api({ url: `api/blogs/${params.slug}`, serverFetch: fetch });
		if (resBlog.body.onlyHTML === 'true') {
			csr = false;
		} else {
			csr = true;
		}

		return {...resBlog.body, content: marked(resBlog.body.content)};
	};

	return {
		blog: loadBlog(),
		host: url.host,
		params
	};
};
