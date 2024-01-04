export const prerender = false;
import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {

	if (params.page && params.page.includes('api')) {
		return;
	}

        const resPage = await api({
			url: `api/pages/${params.page}/${params.sub}`,
			serverFetch: fetch
		});
		csr = resPage.body.onlyHTML !== 'true';

	return {
		subPageWithContent: updatePage(resPage),
		pathname: url.pathname,
		params: params
	};

	function updatePage(resPage) {
		return { ...resPage.body, content: marked(resPage.body.content) };
	}
};
