import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {
	const resPage = await api({
		url: `api/pages/${params.page}/${params.sub}`,
		serverFetch: fetch
	});

	if (resPage) {
		if (resPage.body.onlyHTML === 'true') {
			csr = false;
		} else {
			csr = true;
		}

		return { 
			subPageWithContent: {...resPage.body,content: marked(resPage.body.content)},
			pathname: url.pathname,
			params };
	}

	return {
		subPageWithContent: null,
		pathname: url.pathname,
		params
	};
};
