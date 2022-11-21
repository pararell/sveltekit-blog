import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {
	const resBlog = await api({ url: `api/blogs/${params.slug}`, serverFetch: fetch });

	if (resBlog) {
		if (resBlog.body.onlyHTML === 'true') {
			csr = false;
		} else {
			csr = true;
		}
		console.log(url)
		return {
			blog: { ...resBlog.body, content: marked(resBlog.body.content) },
			host: url.host,
			params
		};
	}

	return {
		blog: null,
		host: url.host,
		params
	};
};
