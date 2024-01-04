export const prerender = false;

import { api } from '$lib/api';
import { minifyHTML } from '$lib/utils';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {

	console.log('params', params);

	const resPage = await api({ url: `api/v1/pages/${params.slug}`, serverFetch: fetch });
    csr = resPage.body.onlyHTML !== 'true';

	return {
		pageWithContent: updatePage(resPage),
		pathname: url.pathname,
		paramsPage: params.slug
	};

	function updatePage(resPage) {
		return { ...resPage.body, content: marked(minifyHTML(resPage.body.content)) };
	}

};
