export const prerender = false;
import { api } from '$lib/api';

export const load = async ({ fetch, params, url }) => {
	const loadPage = async () => {
		let pageQuery = url.searchParams.get('edit') || 'home';
		const resPage = await api({ url: `api/pages/${pageQuery}`, serverFetch: fetch });
		return resPage.body;
	};

	return {
		pageToEdit: await loadPage(),
		pathname: url.pathname,
		paramsPage: params.page
	};
};
