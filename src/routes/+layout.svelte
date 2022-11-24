<script>
	import '../app.css';
	import '../custom.css';
	import Header from '$lib/Header.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { locale } from '$lib/i18n';

	let firstInit = false;
	let openHeader = '';

	const checkLang = (lang) => {
		const langFound =
			browser && ['en', 'sk'].includes(navigator.language) ? navigator.language : 'en';
		const foundLang = lang || langFound;

		locale.set(foundLang);
	};

	const toggleMenu = (event) => {
		if (browser) {
			const menu = document.getElementById('hamburger-trigger');
			if (menu) {
				if (event?.detail?.action === 'close') {
					menu.checked = false;
					openHeader = '';
				} else {
					menu.click();
					openHeader = !openHeader ? 'is-active' : '';
				}
			}
		}
	};

	page.subscribe((p) => {
		toggleMenu({ detail: { action: 'close' } });

		if (p.data.lang && !firstInit) {
			checkLang(p.data.lang);
			firstInit = true;
		}
	});
</script>

<div class="header-wrap {$page.data?.mode}">
	<Header
		on:toggle={toggleMenu}
		active={openHeader}
		pages={$page.data?.pages}
		blogs={$page.data?.blogs}
		user={$page.data?.user}
		lang={$page.data?.lang}
		mode={$page.data?.mode}
		url={$page.url}
	/>
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
