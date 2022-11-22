import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, params, url }) => {
	const loadSubPage = async () => {
		const resPage = await api({
			url: `api/pages/${params.page}/${params.sub}`,
			serverFetch: fetch
		});
		csr = resPage.body.onlyHTML !== 'true';
		return { ...resPage.body, content: marked(resPage.body.content) };
	};

	return {
		subPageWithContent: loadSubPage(),
		pathname: url.pathname,
		params
	};
};
