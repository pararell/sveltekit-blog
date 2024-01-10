export const prerender = false;
import { api } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, fetch, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const res = await api({
			url: `api/v1/login`,
			method: 'POST',
			data: { email, password },
			serverFetch: fetch
		});

		if (res) {
			if (res.status === 400) {
				return { error: res.body };
			}
			if (res.body.token) {
				cookies.set('token', res.body.token, { path: '/' });
			}

			redirect(303, '/');
		}
	},
	logout: async ({ fetch, cookies }) => {
		const _res = await api({ url: 'api/v1/logout', serverFetch: fetch });
		cookies.set('token', '', { path: '/' });
		if (_res) {
			redirect(303, '/');
		}
	}
};
