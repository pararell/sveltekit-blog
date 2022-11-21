import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {
	const loadPage = async () => {
		const resPage = await api({ url: `api/pages/${params.page}`, serverFetch: fetch });
		if (resPage.body.onlyHTML === 'true') {
			csr = false;
		} else {
			csr = true;
		}
		return { ...resPage.body, content: marked(resPage.body.content) };
	};

	return {
		pageWithContent: loadPage(),
		pathname: url.pathname,
		paramsPage: params.page
	};
};
