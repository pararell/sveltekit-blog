import { browser } from '$app/environment';
import { api } from '$lib/api';
import { user, config, pages, blogs } from '$lib/store';
import { setLocale, loadTranslations, } from '$lib/translations';
import { filter, take } from 'rxjs/operators';
// const setJSONLangs = (langs) => {
// 	const translationsPath = import.meta.glob('../translations/*.json');
// 	langs.forEach((lang) => {
// 		register(lang, async () => {
// 			const langKey = Object.keys(translationsPath).find((l) => l.includes(lang));
// 			if (langKey) {
// 				return await translationsPath[langKey]();
// 			}
// 		});
// 	});
// };

const setLang = async() => {
	config
		.pipe(
			filter((configValue) => !!configValue),
			take(1)
		)
		.subscribe(async (configValue) => {
			const langFound =
				browser && ['en', 'sk'].includes(navigator.language) ? navigator.language : 'en';
			const lang = configValue.lang || langFound;

			setLocale(lang);

			if (!configValue.lang) {
				api({ url: 'api/lang', method: 'POST', data: { lang } });
			}
		});
};



export const load = async ({ fetch, url }) => {
	const {pathname} = url;
	await loadTranslations( 'sk', pathname); 
	await loadTranslations( 'en', pathname); 
	setLang();

	const resUser = api({ url: 'api/user', serverFetch: fetch });
	const resConfig = api({ url: 'api/config', serverFetch: fetch });
	const resPages = api({ url: 'api/pages', serverFetch: fetch });
	const resBlogs = api({ url: 'api/blogs', serverFetch: fetch });

	const loadedData = await Promise.all([resUser, resConfig, resPages, resBlogs]);

	if (loadedData) {
		user.next(loadedData[0].body);
		config.next(loadedData[1].body);
		pages.next(loadedData[2].body);
		blogs.next(loadedData[3].body);

		

		return {
			user: loadedData[0].body,
			config: loadedData[1].body,
			pages: loadedData[2].body,
			blogs: loadedData[3].body,
			}
		};

	return {
		error: new Error()
	};
};
