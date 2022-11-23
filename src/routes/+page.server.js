import { api } from '$lib/api';
import { marked } from 'marked';
import { redirect } from '@sveltejs/kit';

export let csr = true;

export const load = async ({ fetch, params, depends }) => {
	const getHomePage = async () => {
		const resPage = await api({ url: 'api/pages/home', serverFetch: fetch });
		csr = resPage.body.onlyHTML !== 'true';
		return { ...resPage.body, content: marked(resPage.body.content) };
	};

	depends('app:home');

	return {
		params,
		home: getHomePage()
	};
};


export const actions = {
  default: async ({cookies, request}) => {
		const data = await request.formData();
		const lang = data.get('lang');
		cookies.set('lang', lang);
		throw redirect(303, '/');
  }
};