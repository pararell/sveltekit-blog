import { api } from '$lib/api';
import { loadTranslations, locale } from '$lib/translations';


export async function load({ fetch, url }) {
	let loc = locale.get();
	const {pathname} = url;
	if (loc) {
		await loadTranslations(loc, pathname); 
	} else {
		await loadTranslations('sk', pathname);
		await loadTranslations('en', pathname);
	}

	const fetchUser = async () => {
		const response = await api({ url: 'api/user', serverFetch: fetch });
		return response.body;
	}

	const fetchConfig = async () => {
		const response = await api({ url: 'api/config', serverFetch: fetch });
		return response.body;
	}

	const fetchPages = async () => {
		const response = await api({ url: 'api/pages', serverFetch: fetch });
		return response.body;
	}

	const fetchBlogs = async () => {
		const response = await api({ url: 'api/blogs', serverFetch: fetch });
		return response.body;
	}

		return {
			user: fetchUser(),
			config: fetchConfig(),
			pages: fetchPages(),
			blogs: fetchBlogs(),
			}
};
