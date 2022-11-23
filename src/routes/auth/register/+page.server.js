import { api } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const actions = {
	register: async ({ request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email');
    const username = data.get('username');
		const password = data.get('password');
		const res = await api({
			url: `api/register`,
			method: 'POST',
			data: { email, username, password },
			serverFetch: fetch
		});

		if (res) {
			if (res.status === 400) {
				return { error: res.body };
			}
			throw redirect(303, '/auth/login');
		}
	}
};