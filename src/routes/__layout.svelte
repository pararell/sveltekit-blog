<script context="module">
	import { api } from '$lib/api';
	import { user, config, pages, blogs } from '$lib/store';
	import { register, init, isLoading, getLocaleFromNavigator } from 'svelte-i18n';
	import { filter, take } from 'rxjs/operators';

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

	const setJSONLangs = (langs) => {
	  const translationsPath = import.meta.glob('../translations/*.json');
			langs.forEach((lang) => {
			register(lang, async() => {
				const langKey = Object.keys(translationsPath).find(l => l.includes(lang));
				if (langKey) {
					return await translationsPath[langKey]()
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
</script>

<script>
	import '../app.css';
	import '../custom.css';
	import Header from '$lib/Header.svelte';
	import { page } from '$app/stores';
import { browser } from '$app/env';
	export let openHeader = '';

	page.subscribe(() => {
		openHeader = '';
	});

	const toggleMenu = (event) => {
		if (event && event.detail && event.detail.action === 'close') {
			openHeader = '';
			return;
		}
		if (openHeader === 'is-active') {
			openHeader = '';
		} else {
			openHeader = 'is-active';
		}
	};
</script>

{#if $isLoading}
	<div class="loading" />
{:else}
	<div class="header-wrap">
		<Header on:toggle={toggleMenu} active={openHeader} />
	</div>
	<main id="main">
		<slot />
	</main>

	<footer>
		<p />
	</footer>
{/if}

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
		margin-top: var(--header-height);
		min-height: calc(85vh - var(--header-height));
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
		min-height: 100px;
		background-color: var(--primary-color);
	}

	.loading {
		height: 0;
		width: 0;
		padding: 15px;
		border: 6px solid var(--secondary-color);
		border-right-color: var(--primary-color);
		border-radius: 22px;
		position: absolute;
		left: 50%;
		top: 50%;
	}

	@-webkit-keyframes rotate {
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
</style>
