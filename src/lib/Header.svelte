<script>
	import { t, locale, locales } from '$lib/i18n';
	import { createEventDispatcher, onMount } from 'svelte';
	import { HEADER_LOGO, ADMIN_EMAIL } from './constants';

	const dispatch = createEventDispatcher();

	let selected;
	export let active = '';
	export let pages;
	export let blogs;
	export let user;
	export let url;

	locale.subscribe((value) => {
		selected = value;
	});

	$: pagesInMenu = () => {
		const basicPages = pages.filter((onePage) => onePage.url.split('/').length <= 1);
		const subPages = pages.filter((onePage) => onePage.url.split('/').length > 1);
		return basicPages
			.sort((a, b) => +a.position - +b.position)
			.map((basicPage) => {
				const subpagesForPage = subPages.filter((subP) => subP.url.split('/')[0] === basicPage.url);
				if (subpagesForPage.length) {
					return {
						...basicPage,
						subPages: subpagesForPage.map((subPage) => ({ ...subPage, subpage: true }))
					};
				}
				return basicPage;
			});
	};

	$: categories = () => {
		if (!blogs) {
			return [];
		}
		return [
			...new Set(blogs.map((blog) => blog.categories.split(',').map((cat) => cat.trim())).flat())
		];
	};

	const toggleMenu = () => {
		dispatch('toggle');
	};

	onMount(() => {
		document.getElementById('main').addEventListener('click', () => {
			dispatch('toggle', {
				action: 'close'
			});
		});
	});
</script>

<header id="header" class={active}>
	<div class="container">
		<div class="header-menu">
			<a href="/" class="logo">{HEADER_LOGO}</a>
			{#if blogs?.length}
				<a class="menu-link" class:active={url.pathname === '/blogs'} href="/blogs">Blog</a>
			{/if}
			{#each pagesInMenu() as pageToShow (pageToShow.id)}
				{#if pageToShow.url !== '/' && !pageToShow.subpage}
					<a
						rel={pageToShow.description === 'reload' ? 'external' : ''}
						class="menu-link"
						class:active={url.pathname === pageToShow.url}
						href="/{pageToShow.url}">{pageToShow.title}</a
					>
				{/if}
			{/each}
			<div class="menu-links">
				<input
					id="hamburger-trigger"
					class="hamburger hamburger-trigger {active}"
					type="checkbox"
					aria-label="open the navigation"
				/>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<label class="hamburger-box" for="hamburger-trigger" on:click={toggleMenu}>
					<span class="hamburger-inner" />
					<span class="hamburger-label">Menu</span>
				</label>
			</div>
		</div>

		<nav id="site-nav" class={active}>
			<div class="col">
				<h4>MS</h4>
				<ul>
					<li class:active={url.pathname === '/'}>
						<a href="/">{$t('home')}</a>
					</li>
					{#if blogs?.length}
						<li class:active={url.pathname === '/blogs'}>
							<a href="/blogs">Blog</a>
						</li>
					{/if}
					{#each pagesInMenu() as pageToShow (pageToShow.id)}
						{#if pageToShow.url !== '/'}
							<li class:active={url.pathname === pageToShow.url}>
								<a href="/{pageToShow.url}">{pageToShow.title}</a>
								{#if pageToShow.subPages?.length}
									{#each pageToShow.subPages as subpageToShow (subpageToShow.id)}
										<li class:active={url.pathname === subpageToShow.url}>
											<a href="/{subpageToShow.url}">{subpageToShow.title}</a>
										</li>
									{/each}
								{/if}
							</li>
						{/if}
					{/each}
					{#if user?.email === ADMIN_EMAIL}
						<br />
						<li><a href="/add">Add page</a></li>
						<li><a href="/edit">Edit page</a></li>
					{/if}
				</ul>
				{#if user?.email}
				<form class="logout" method="POST" action="/auth/login?/logout">
					<button type="submit">Logout</button>
				</form>
			{/if}
			</div>
			{#if blogs?.length}
				<div class="col">
					<h4>Blog</h4>
					<ul>
						{#if blogs}
							{#each blogs.slice(0, 3) as blog}
								<li><a href="/blogs/{blog.slug}">{blog.title}</a></li>
							{/each}
						{/if}
						{#if user?.email === ADMIN_EMAIL}
							<br />
							<li><a href="/blogs/add">Add blog</a></li>
							<li><a href="/blogs/edit">Edit blog</a></li>
						{/if}
					</ul>
				</div>
			{/if}
			{#if categories().length}
				<div class="col">
					<h4>{$t('categories')}</h4>
					<ul>
						{#each categories() as category}
							<li><a href="/blogs/category/{category}">{category}</a></li>
						{/each}
					</ul>
				</div>
			{/if}
			<div class="col">
				<div class="switcher">
					<!-- svelte-ignore a11y-no-onchange -->
					<form method="POST" action="/">
						<select name="lang" bind:value={selected}>
							{#each locales as language}
								<option value={language}>
									{language}
								</option>
							{/each}
						</select>
						<button type="submit">Switch lang</button>
					</form>
				</div>
			</div>
		</nav>
	</div>
</header>

<style type="text/scss">
	.logo {
		color: #fff;
		font-weight: 700;
		font-size: calc(var(--header-height) - 10px);
		line-height: 1;
		border-radius: 50%;
		width: 80px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 5px;
	}

	.logo:hover {
		text-decoration: none;
	}

	.header-menu {
		margin: 0 0 0 auto;
		display: flex;
		align-items: center;
		height: var(--header-height);
	}

	.menu-links {
		margin-left: auto;
		margin-right: 0;
	}

	.menu-link {
		color: var(--text-color-header);
		font-weight: 600;
		letter-spacing: 0.08em;
		line-height: 1;
		padding: 0 0.5em;
		display: inline-block;
	}
	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: center;
		color: #b4b9ba;
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 10%;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	@media screen and (max-width: 960px) {
		.menu-link {
			display: none;
		}
	}

	.switcher {
		margin: auto;
	}

	.switcher select {
		appearance: none;
		background-color: transparent;
		border: none;
		padding: 0 1em 0 0;
		margin: 0;
		width: 100%;
		font-family: inherit;
		font-size: inherit;
		cursor: inherit;
		line-height: inherit;
		text-transform: uppercase;
	}

	.logout {
		text-align: center;
	}

	#header {
		position: relative;
	}

	#header:has(.hamburger-trigger:checked) {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
		background: #fff;
		overflow: auto;
		min-height: 500px;
	}

	#header.is-active {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
		background: #fff;
		overflow: auto;
		min-height: 500px;
	}

	@media screen and (max-width: 768px) {
		#header:has(.hamburger-trigger:checked) {
			height: 100vh;
		}

		#header.is-active {
			height: 100vh;
		}
	}

	#header:after {
		content: '';
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	#header:has(.hamburger-trigger:checked):after {
		opacity: 1;
	}

	#header.is-active:after {
		opacity: 1;
	}

	.hamburger {
		background-color: transparent;
		border: 0;
		color: inherit;
		cursor: pointer;
		display: inline-block;
		overflow: visible;
		outline: none;
		padding: 0;
		text-transform: none;
		transition: opacity 0.15s;
		-webkit-appearance: none;
	}

	.hamburger:hover {
		opacity: 0.7;
	}

	.hamburger-box {
		display: inline-block;
		position: relative;
	}

	.hamburger-inner {
		display: block;
		top: 50%;
		margin-top: -2px;
	}

	.hamburger-inner,
	.hamburger-inner::before,
	.hamburger-inner::after {
		width: 30px;
		height: 2px;
		background-color: #fff;
		border-radius: 4px;
		position: absolute;
		transition-property: -webkit-transform;
		transition-property: transform;
		transition-property: transform, -webkit-transform;
		transition-duration: 0.15s;
		transition-timing-function: ease;
	}

	#header:has(.hamburger-trigger:checked) .hamburger-inner,
	#header:has(.hamburger-trigger:checked) .hamburger-inner::before,
	#header:has(.hamburger-trigger:checked) .hamburger-inner::after {
		background-color: #000;
	}

	#header.is-active .hamburger-inner,
	#header.is-active .hamburger-inner::before,
	#header.is-active .hamburger-inner::after {
		background-color: #000;
	}

	.hamburger-inner::before,
	.hamburger-inner::after {
		content: '';
		display: block;
	}

	.hamburger-inner::before {
		top: -6px;
	}

	.hamburger-inner::after {
		bottom: -6px;
	}

	.hamburger-trigger .hamburger-inner,
	.hamburger-trigger .hamburger-inner::before,
	.hamburger-trigger .hamburger-inner::after {
		transition-property: none;
	}

	#header:has(.hamburger-trigger:checked),
	#header.is-active {
		.hamburger-inner {
			transform: rotate(45deg);

			&::before {
				top: 0;
				opacity: 0;
			}

			&:after {
				bottom: 0;
				transform: rotate(-90deg);
			}
		}
	}

	#header.is-active {
		.hamburger-inner {
			transform: rotate(45deg);

			&::before {
				top: 0;
				opacity: 0;
			}

			&:after {
				bottom: 0;
				transform: rotate(-90deg);
			}
		}
	}

	.hamburger-label {
		color: #fff;
		display: inline-block;
		font-weight: 700;
		line-height: 1;
		margin-left: 40px;
		text-transform: uppercase;
	}

	#header:has(.hamburger-trigger:checked) .hamburger-label,
	#header.is-active .hamburger-label {
		color: #000;
	}

	#header.is-active .hamburger-label {
		color: #000;
	}

	#site-nav {
		clear: both;
		display: flex;
		flex-direction: column;
		height: 0;
		overflow: hidden;
		padding-top: 1em;
	}

	#header:has(.hamburger-trigger:checked) #site-nav,
	#site-nav.is-active {
		height: auto;
		overflow: visible;
	}

	#site-nav.is-active {
		height: auto;
		overflow: visible;
	}

	#site-nav .col {
		padding-bottom: 1em;
	}

	@media screen and (min-width: 550px) {
		#site-nav {
			flex-direction: row;
			flex-wrap: wrap;
		}

		#site-nav .col {
			flex: 0 0 50%;
		}
	}

	@media screen and (min-width: 768px) {
		#site-nav .col {
			flex: 0 0 33.333333333%;
		}
	}

	@media screen and (min-width: 960px) {
		#site-nav {
			flex-wrap: nowrap;
		}

		#site-nav .col {
			flex: 0 0 20%;
		}
	}

	#site-nav h4 {
		letter-spacing: 0.05em;
		text-transform: uppercase;
		text-align: center;
	}

	#site-nav ul {
		list-style-type: none;
		margin-top: 1em;
	}

	#site-nav li {
		margin-bottom: 0.3125em;
	}

	#site-nav li li {
		padding-left: 20px;
	}

	#site-nav li a:hover,
	#site-nav li a:focus {
		color: #686d6e;
	}

	#header .col {
		opacity: 0;
	}

	#header:has(.hamburger-trigger:checked),
	#header.is-active {
		.col {
			transform: translateY(40px);
			transition: opacity 0.3s ease;
			animation: fade-in-stagger 0.8s ease forwards;

			&:nth-child(1) {
				-webkit-animation-delay: 0;
			}

			&:nth-child(2) {
				-webkit-animation-delay: 0.1s;
			}

			&:nth-child(3) {
				-webkit-animation-delay: 0.2s;
			}

			&:nth-child(4) {
				-webkit-animation-delay: 0.3s;
			}

			&:nth-child(5) {
				-webkit-animation-delay: 0.4s;
			}
		}
	}

	#header.is-active {
		.col {
			transform: translateY(40px);
			transition: opacity 0.3s ease;
			animation: fade-in-stagger 0.8s ease forwards;

			&:nth-child(1) {
				-webkit-animation-delay: 0;
			}

			&:nth-child(2) {
				-webkit-animation-delay: 0.1s;
			}

			&:nth-child(3) {
				-webkit-animation-delay: 0.2s;
			}

			&:nth-child(4) {
				-webkit-animation-delay: 0.3s;
			}

			&:nth-child(5) {
				-webkit-animation-delay: 0.4s;
			}
		}
	}

	@keyframes fade-in-stagger {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
