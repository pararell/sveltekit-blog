export const prerender = false;

import { api } from '$lib/api';
import { marked } from 'marked';

export let csr = true;

export const load = async ({ fetch, depends }) => {
	const resPage = await api({ url: 'api/v1/pages/home', serverFetch: fetch });
	csr = resPage.body.onlyHTML !== 'true';

	depends('app:home');

	return {
		home: updatePage(resPage)
	};

	function updatePage(resPage) {
		return { ...resPage.body, content: marked(resPage.body.content) };
	}
};
