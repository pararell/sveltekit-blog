<script context="module">
	import { api } from '$lib/api';
	import { user, config, blogs } from '$lib/store';
	import { register, init, isLoading, getLocaleFromNavigator } from 'svelte-i18n';
	import { filter, take } from 'rxjs/operators';

	export const load = async ({ fetch, page }) => {
		if (user.value && config.value && blogs.value) {
			return {
				props: {},
				maxage: 0
			};
		}

		const resUser = await api({ resource: 'api/user', serverFetch: fetch });
		const resConfig = await api({ resource: 'api/config', serverFetch: fetch });
		const resBlogs = await api({ resource: 'api/blogs', serverFetch: fetch });

		if (resUser && resConfig && resBlogs) {
			user.next(resUser.body);
			config.next(resConfig.body);
			blogs.next(resBlogs.body);

			return {
				props: {},
				maxage: 0
			};
		}

		return {
			error: new Error()
		};
	};

	setJSONLangs(['en', 'sk']);
	setLang();

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
					api({ resource: 'api/lang', request: { method: 'POST' }, data: { lang } });
				}
			});
	};
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
		<div class="container">
			<slot />
		</div>
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
		padding: 1rem 0;
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
		background: var(--secondary-color);
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
