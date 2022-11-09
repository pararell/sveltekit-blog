import { api } from '$lib/api';

export const load = async ({ fetch, params, depends }) => {
	const resPage = await api({ url: 'api/pages/home', serverFetch: fetch });

	depends('app:home');

	if (resPage) {
		return { params, home: resPage.body };
	}

	return {
		params,
		home: null
	};
};
