import { pageWithContent } from '$lib/store';
import { api } from '$lib/api';

export const load = async ({ fetch, params }) => {
	const resPage = await api({ url: `api/pages/${params.page}`, serverFetch: fetch });

	if (resPage) {
		pageWithContent.next(resPage.body);
		return { paramsPage: params.page };
	}

	return {
		paramsPage: params.page
	};
};
