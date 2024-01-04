export const prerender = false;
import { api } from '$lib/api';
import { minifyHTML } from '$lib/utils';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {

	if (params.page && params.page.includes('api')) {
		return;
	}


	const resPage = await api({ url: `api/pages/${params.page}`, serverFetch: fetch });
    csr = resPage.body.onlyHTML !== 'true';

	return {
		pageWithContent: updatePage(resPage),
		pathname: url.pathname,
		paramsPage: params.page
	};

	function updatePage(resPage) {
		return { ...resPage.body, content: marked(minifyHTML(resPage.body.content)) };
	}

};
