import { api } from '$lib/api';
import { pageWithContent } from '$lib/store';

export const load = async ({ fetch, params }) => {
	const resPages = await api({ url: 'api/pages/home', serverFetch: fetch });

	if (resPages) {
		pageWithContent.next(resPages.body);
		return { params, home: resPages.body };
	}

	return {
		params,
		home: null
	};
};
