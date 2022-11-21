import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {
	const resPage = await api({ url: `api/pages/${params.page}`, serverFetch: fetch });

	if (resPage) {
		if (resPage.body.onlyHTML === 'true') {
			csr = false;
		} else {
			csr = true;
		}

		return { 
			pageWithContent: {...resPage.body,content: marked(resPage.body.content)}, 
			pathname: url.pathname,
			paramsPage: params.page };
	}

	return {
		pageWithContent: null,
		pathname: url.pathname,
		paramsPage: params.page
	};
};
