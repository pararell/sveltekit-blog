import { api } from '$lib/api';
// export const csr = false;
export const load = async ({ fetch, params }) => {
	const resPages = await api({ url: 'api/pages/home', serverFetch: fetch });

	if (resPages) {
		return { params, home: resPages.body };
	}

	return {
		params,
		home: null
	};
};
