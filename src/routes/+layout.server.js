export const prerender = false;
import { api } from '$lib/api';
import { env } from '$env/dynamic/public';

export async function load({ fetch, locals }) {
	const fetchUser = async () => {
		const authorization = locals.token ? { authorization: locals.token } : {};
		const response = await api({ url: 'api/v1/user', serverFetch: fetch, authorization });
		const user = response.body
			? { ...response.body, isAdmin: response.body.email === env.PUBLIC_ADMIN_EMAIL }
			: response.body;
		return user;
	};

	const fetchPages = async () => {
		const response = await api({ url: 'api/v1/pages', serverFetch: fetch });
		return response.body;
	};

	const fetchBlogs = async () => {
		const response = await api({ url: 'api/v1/blogs', serverFetch: fetch });
		return response.body;
	};

	return {
		user: await fetchUser(),
		pages: await fetchPages(),
		blogs: await fetchBlogs(),
		lang: locals.lang,
		mode: locals.mode,
		token: locals.token,
		pageEnv: {
			HEADER_LOGO: env.PUBLIC_HEADER_LOGO,
			DISQUSSRC: env.PUBLIC_DISQUS_URL
		}
	};
}
