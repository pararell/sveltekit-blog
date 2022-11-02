import { api } from '$lib/api';
import { user, config, pages, blogs } from '$lib/store';
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { filter, take } from 'rxjs/operators';

const setJSONLangs = (langs) => {
	const translationsPath = import.meta.glob('../translations/*.json');
	langs.forEach((lang) => {
		register(lang, async () => {
			const langKey = Object.keys(translationsPath).find((l) => l.includes(lang));
			if (langKey) {
				return await translationsPath[langKey]();
			}
		});
	});
};

const setLang = () => {
	config
		.pipe(
			filter((configValue) => !!configValue),
			take(1)
		)
		.subscribe((configValue) => {
			const langFromNavigator = getLocaleFromNavigator();
			const langFound =
				langFromNavigator && ['en', 'sk'].includes(langFromNavigator) ? langFromNavigator : 'en';
			const lang = configValue.lang || langFound;

			init({
				fallbackLocale: 'en',
				initialLocale: configValue.lang || langFound
			});

			if (!configValue.lang) {
				api({ url: 'api/lang', method: 'POST', data: { lang } });
			}
		});
};

setJSONLangs(['en', 'sk']);
setLang();

export const load = async ({ fetch }) => {
	const resUser = api({ url: 'api/user', serverFetch: fetch });
	const resConfig = api({ url: 'api/config', serverFetch: fetch });
	const resPages = api({ url: 'api/pages', serverFetch: fetch });
	const resBlogs = api({ url: 'api/blogs', serverFetch: fetch });

	const data = await Promise.all([resUser, resConfig, resPages, resBlogs]);

	if (data) {
		user.next(data[0].body);
		config.next(data[1].body);
		pages.next(data[2].body);
		blogs.next(data[3].body);

		return {
			props: {},
			cache: {
				maxage: 240
			}
		};
	}

	return {
		error: new Error()
	};
};
