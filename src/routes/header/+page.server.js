import { redirect } from '@sveltejs/kit';

export const prerender = false;

export const actions = {
	langSwitch: async ({ cookies, request }) => {
		const data = await request.formData();
		const lang = data.get('lang');
		cookies.set('lang', lang, { path: '/' });
		redirect(303, '/');
	},
	modeSwitch: async ({ cookies, request }) => {
		const data = await request.formData();
		const actualMode = data.get('mode');
		const mode = actualMode === 'light' ? 'dark' : 'light';
		cookies.set('mode', mode, { path: '/' });
		redirect(303, '/');
	}
};
