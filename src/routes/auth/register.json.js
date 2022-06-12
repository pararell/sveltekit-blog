import { api } from '$lib/api';

export const post = async ({ request }) => {
	const form = await request.formData();
	const data = {
		Email: form.get('Email'),
		Username: form.get('Username'),
		Password: form.get('Password')
	};
	return api({ url: `api/register`, method: 'POST', data });
};
