import { api } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, fetch, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const res = await api({
			url: `api/login`,
			method: 'POST',
			data: { email, password },
			serverFetch: fetch
		});

		if (res) {
			if (res.status === 400) {
				return { error: res.body };
			}
			if (res.body.token) {
				cookies.set('token', res.body.token);
			}
		
			throw redirect(303, '/');
		}
	},
	logout: async ({ fetch }) => {
		const _res = await api({ url: 'api/logout', serverFetch: fetch });
		if (_res) {
			throw redirect(303, '/');
		}
	}
};
