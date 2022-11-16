<script>
	import '../app.css';
	import '../custom.css';
	import Header from '$lib/Header.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { setLocale } from '$lib/translations';
	import { api } from '$lib/api';

	export let openHeader = '';

	page.subscribe((p) => {
		openHeader = '';
		if (p.data.config) {
			const langFound = browser && ['en', 'sk'].includes(navigator.language) ? navigator.language : 'en';
			const lang = p.data.config.lang || langFound;

			if (!p.data.config.lang) {
				api({ url: 'api/lang', method: 'POST', data: { lang } });
			}

			setLocale(lang);
		}
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
	<div class="header-wrap">
		<Header on:toggle={toggleMenu} active={openHeader} pages={$page.data?.pages} blogs={$page.data?.blogs} />
	</div>
	<main id="main">
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
</style>
