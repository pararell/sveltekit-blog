export const prerender = false;
import { api } from '$lib/api';

export const load = async ({ fetch, params, url, locals }) => {
	const authorization = locals.token ? { authorization: locals.token } : {};
	const loadPage = async () => {
		let pageQuery = url.searchParams.get('edit') || 'home';
		const resPage = await api({
			url: `api/v1/pages/${pageQuery}`,
			serverFetch: fetch,
			authorization
		});
		return resPage.body;
	};

	return {
		pageToEdit: await loadPage(),
		pathname: url.pathname,
		paramsPage: params.page
	};
};
