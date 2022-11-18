import { api } from '$lib/api';

export const load = async ({ fetch, url, params }) => {
	const resPage = await api({
		url: `api/pages/${params.page}/${params.sub}`,
		serverFetch: fetch
	});

	if (resPage) {
		return { url, params, subPageWithContent: resPage.body };
	}

	return {
		subPageWithContent: null,
		url,
		params
	};
};
