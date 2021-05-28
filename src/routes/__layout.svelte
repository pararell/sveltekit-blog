<script context="module">
	import { api } from '$lib/api';
	import { user, config, blogs } from '$lib/store/store';
	import { register, init, isLoading, getLocaleFromNavigator } from 'svelte-i18n';
	import { filter } from 'rxjs/internal/operators/filter.js';
	import { take } from 'rxjs/internal/operators/take.js';

	register('en', () => import('../translations/en.json'));
	register('sk', () => import('../translations/sk.json'));

	config.pipe(filter((config) => !!config, take(1))).subscribe((config) => {
		const lang = config.lang || getLocaleFromNavigator();
		init({
			fallbackLocale: 'sk',
			initialLocale: config.lang || getLocaleFromNavigator()
		});

		if (!config.lang) {
			api('api/lang', { method: 'POST' }, { lang });
		}
	});

	export const load = async ({ fetch, page }) => {
		if (user.value && config.value && blogs.value) {
			return {
				props: {},
				maxage: 0
			};
		}

		const resUser = await api('api/user', null, null, fetch);
		const resConfig = await api('api/config', null, null, fetch);
		const resBlogs = await api('api/blogs', null, null, fetch);

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
</script>

<script>
	import Header from '$lib/Header.svelte';
	import { page } from '$app/stores';
	import '../app.css';
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
	Loading...
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
</style>
