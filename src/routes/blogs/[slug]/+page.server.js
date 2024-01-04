export const prerender = false;

import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {

	const resBlog = await api({ url: `api/blogs/${params.slug}`, serverFetch: fetch });
	csr = resBlog.body.onlyHTML !== 'true';

	return {
		blog: updatePage(resBlog),
		host: url.host,
		params:  params
	};

	function updatePage(resPage) {
		return { ...resPage.body, content: marked(resPage.body.content) };
	}
};
