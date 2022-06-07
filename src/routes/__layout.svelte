<script context="module">
	import { api } from '$lib/api';
	import { user, config, blogs, pages } from '$lib/store';
	import { register, init, isLoading, getLocaleFromNavigator } from 'svelte-i18n';
	import { filter, take } from 'rxjs/operators';

	export const load = async ({ fetch }) => {
		if (user.value && config.value && blogs.value && pages.value) {
			return {
				props: {},
				cache: 0
			};
		}

		const resUser = await api({ url: 'api/user', serverFetch: fetch });
		const resConfig = await api({ url: 'api/config', serverFetch: fetch });
		const resBlogs = await api({ url: 'api/blogs', serverFetch: fetch });
		const resPages = await api({ url: 'api/pages', serverFetch: fetch });

		if (resUser && resConfig && resBlogs && resPages) {
			user.next(resUser.body);
			config.next(resConfig.body);
			blogs.next(resBlogs.body);
			pages.next(resPages.body);

			return {
				props: {},
				cache: 0
			};
		}

		return {
			error: new Error()
		};
	};

	const setJSONLangs = (langs) => {
		langs.forEach((lang) => {
			register(lang, () => import('../translations/' + lang + '.json'));
		});
	};

	const setLang = () => {
		config
			.pipe(
				filter((configValue) => !!configValue),
				take(1)
			)
			.subscribe((configValue) => {
				const lang = configValue.lang || getLocaleFromNavigator();
				init({
					fallbackLocale: 'en',
					initialLocale: configValue.lang || getLocaleFromNavigator()
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
	import Header from '$lib/Header.svelte';
	import { page } from '$app/stores';
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
	<div class="hero">
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
		background-color: #485461;
		background-image: linear-gradient(315deg, #485461 0%, #28313b 74%);
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
