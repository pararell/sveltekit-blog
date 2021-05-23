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

		const blogsPath = page.path.includes('blogs/') ? 'blogs.json' : 'blogs/blogs.json';

		const resUser = await api('api/user', null, null, fetch);
		const resConfig = await api('api/config', null, null, fetch);
		const resBlogs = await fetch(blogsPath);

		if (resUser && resConfig && resBlogs.ok) {
			const blogsFromApi = await resBlogs.json();
			user.next(resUser.body);
			config.next(resConfig.body);
			blogs.next(blogsFromApi);

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
	import '../app.css';
</script>

{#if $isLoading}
	Loading...
{:else}
	<div class="hero">
		<Header />
	</div>
		<main>
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
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
