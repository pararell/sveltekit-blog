<script>
	import '../app.css';
	import '../custom.css';
	import Header from '$lib/Header.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { locale } from '$lib/i18n';
	let { children } = $props();

	let firstInit = false;
	let openHeader = $state('');

	const checkLang = (lang) => {
		const langFound =
			browser && ['en', 'sk'].includes(navigator.language) ? navigator.language : 'en';
		const foundLang = lang || langFound;

		locale.set(foundLang);
	};

	const toggleMenu = (action) => {
		if (browser) {
			const menu = document.getElementById('hamburger-trigger');
			if (menu) {
				if (action === 'close') {
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
		toggleMenu('close');

		if (p.data.lang && !firstInit) {
			checkLang(p.data.lang);
			firstInit = true;
		}
	});
</script>

<div class="header-wrap {$page.data?.mode}">
	<Header
	    toggle={toggleMenu}
		active={openHeader}
		pages={$page.data?.pages}
		blogs={$page.data?.blogs}
		user={$page.data?.user}
		lang={$page.data?.lang}
		mode={$page.data?.mode}
		headerLogo={$page.data?.pageEnv?.HEADER_LOGO}
		url={$page.url}
	/>
</div>
<main id="main" class={$page.data?.mode}>
	{@render children?.()}
</main>

<footer class={$page.data?.mode}>
	<p></p> 
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
		background: var(--primary-color);
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
