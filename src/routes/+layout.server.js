export const prerender = true;
import { api } from '$lib/api';

export async function load({ fetch, locals }) {
	const fetchUser = async () => {
		const response = await api({ url: 'api/user', serverFetch: fetch });
		return response.body;
	};

	const fetchPages = async () => {
		const response = await api({ url: 'api/pages', serverFetch: fetch });
		return response.body;
	};

	const fetchBlogs = async () => {
		const response = await api({ url: 'api/blogs', serverFetch: fetch });
		return response.body;
	};

	// setHeaders({
	//   'cache-control': 'public, max-age=60'
	// })

	return {
		user: fetchUser(),
		pages: fetchPages(),
		blogs: fetchBlogs(),
		lang: locals.lang,
		mode: locals.mode
	};
}
