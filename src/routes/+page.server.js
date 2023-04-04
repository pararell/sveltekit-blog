import { api } from '$lib/api';
import { marked } from 'marked';
import { redirect } from '@sveltejs/kit';

export const prerender = false;;
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
	langSwitch: async ({ cookies, request }) => {
		const data = await request.formData();
		const lang = data.get('lang');
		cookies.set('lang', lang);
		throw redirect(303, '/');
	},
	modeSwitch: async ({ cookies, request }) => {
		const data = await request.formData();
		const actualMode = data.get('mode');
		const mode = actualMode === 'light' ? 'dark' : 'light';
		cookies.set('mode', mode);
		throw redirect(303, '/');
	}
};
