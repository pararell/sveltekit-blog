<script context="module">
	import Cookie from 'cookie-universal';
	import { user, config, lang, translations } from '$lib/store/store';
	import { locale, dictionary } from 'svelte-i18n';

	const cookies = Cookie();
	const cookieLang = cookies.get('blog_lang') || 'en';
	lang.next(cookieLang);
	locale.set(cookieLang);
	

	export const load = async ({ fetch }) => {
		if (user.value && config.value && translations.value) {
			return {
				props: { user: user.value, config: config.value },
				context: { user: user.value, config: config.value }
			};
		}

		const resUser = await fetch('/user.json');
		const resConfig = await fetch('/config.json');
		const resTranslations = await fetch('/translations.json');

		if (resUser.ok && resConfig.ok && resTranslations.ok) {
			const userFromApi = await resUser.json();
			const configFromApi = await resConfig.json();
			const translationsFromApi = await resTranslations.json();
			user.next(userFromApi);
			config.next(configFromApi);
			translations.next(translationsFromApi);

			dictionary.set({
				[lang.value]: translationsFromApi
			});

			return {
				props: { user: userFromApi, config: configFromApi },
				context: { user: userFromApi, config: configFromApi }
			};
		}

		const { message } = await resUser.json();

		return {
			error: new Error(message)
		};
	};

</script>

<script>
	import Header from '$lib/Header/index.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p />
</footer>

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
