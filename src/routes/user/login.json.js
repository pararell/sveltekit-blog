import { api } from '$lib/api';

export const post = async ({request}) => {
  const form = await request.formData();

	const data = {
		Email: form.get('Email'),
    Password: form.get('Password'),
	}
	return api({url: `api/login`, method: 'POST', data});
};
