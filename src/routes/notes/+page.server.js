export const prerender = false;
import { api } from '$lib/api';
import { marked } from 'marked';

export const load = async ({ fetch, params, url, locals }) => {
	const authorization = locals.token ? { authorization: locals.token } : {};

	const fetchNotes = async () => {
		const response = await api({ url: 'api/v1/notes', serverFetch: fetch, authorization });

		if (response.status === 401) {
			return [];
		}

		return response.body;
	};

	const loadNote = async () => {
		let pageQuery = url.searchParams.get('edit');
		if (pageQuery) {
			const response = await api({
				url: `api/v1/notes/${pageQuery}`,
				serverFetch: fetch,
				authorization
			});

			if (!response?.body) {
				return {};
			}
			return {...response.body, content: marked(response.body.content)};
		}
	};


	return {
		notes: await fetchNotes(),
		noteToEdit: await loadNote(),
		pathname: url.pathname,
		paramsPage: params.page
	};
    
};
