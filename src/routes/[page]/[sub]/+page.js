import { pageWithContent } from '$lib/store';
import { api } from '$lib/api';

	export const load = async ({ fetch, url, params }) => {
		const resPage = await api({
			url: `api/pages/${params.page}/${params.sub}`,
			serverFetch: fetch
		});

		if (resPage) {
			pageWithContent.next(resPage.body);
			return { url, params };
		}

		return {
				url,
				params
		};
	};