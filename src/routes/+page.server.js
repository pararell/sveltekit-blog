import { api } from '$lib/api';
import { marked } from 'marked';

export const load = async ({ fetch, params, depends }) => {
	const getHomePage = async() => {
		const resPage = await api({ url: 'api/pages/home', serverFetch: fetch });
		return {...resPage.body,content: marked(resPage.body.content)};
	}

	depends('app:home');

	return {
		params,
		home: getHomePage()
	};
};
