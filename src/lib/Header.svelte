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
	export let lang;
	export let mode;

	if (lang) {
		selected = lang;
	}

	locale.subscribe((value) => {
		selected = value;
	});

	$: pagesInMenu = () => {
		const basicPages = pages.filter((onePage) => onePage.url.split('/').length <= 1 && onePage.hidden !== 'true');
		const subPages = pages.filter((onePage) => onePage.url.split('/').length > 1 && onePage.hidden !== 'true');
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
			<form class="light-switcher" method="POST" action="/?/modeSwitch">
				<input type="text" name="mode" bind:value={mode} class="hidden" />
				<button type="submit">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="light-switch"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/></svg
					>
				</button>
			</form>
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
								<a 
									rel={pageToShow.description === 'reload' ? 'external' : ''}
									href="/{pageToShow.url}">{pageToShow.title}</a>
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
					<form method="POST" action="/?/langSwitch">
						<select name="lang" bind:value={selected}>
							{#each locales as language}
								<option value={language} selected={language === selected ? true : false}>
									{language}
								</option>
							{/each}
						</select>
						<button type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m12.05 19 2.85-2.825-2.85-2.825L11 14.4l1.075 1.075q-.7.025-1.362-.225-.663-.25-1.188-.775-.5-.5-.763-1.15-.262-.65-.262-1.3 0-.425.113-.85.112-.425.312-.825l-1.1-1.1q-.425.625-.625 1.325T7 12q0 .95.375 1.875t1.1 1.65q.725.725 1.625 1.088.9.362 1.85.387l-.95.95Zm4.125-4.25q.425-.625.625-1.325T17 12q0-.95-.362-1.888-.363-.937-1.088-1.662-.725-.725-1.637-1.075-.913-.35-1.863-.35L13 6.05 11.95 5 9.1 7.825l2.85 2.825L13 9.6l-1.1-1.1q.675 0 1.375.262.7.263 1.2.763t.763 1.15q.262.65.262 1.3 0 .425-.113.85-.112.425-.312.825ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"/></svg>					</form>
				</div>
			</div>
		</nav>
	</div>
</header>

<style type="text/scss">
	.logo {
		color: var(--text-color-header);
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

		button {
			all: unset;
			cursor: pointer;

			svg {
			fill:  var(--text-color-header);
			}

		}

		select {
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
			color: var(--text-color-header);
		}
	}

	.logout {
		text-align: center;

		button {
			all: unset;
			cursor: pointer;
			font-size: 0.8rem;
			color: #b4b9ba;
			text-transform: uppercase;
		}
	}

	.light-switcher {
		display: flex;
		align-items: center;
		margin-left: 20px;

		button {
			all: unset;
			cursor: pointer;
			display: flex;
		}

		input {
			display: none;
		}

		.light-switch {
			width: 1.4rem;
			color: var(--text-color-header);
		}
	}

	#header {
		position: relative;
	}

	#header:has(.hamburger-trigger:checked) {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
		background: var(--primary-color);
		overflow: auto;
		min-height: 500px;
	}

	#header.is-active {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
		background: var(--primary-color);
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
		background-color: var(--primary-color);
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
		background-color: var(--text-color-header);
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
		background-color: var(--text-color-header);
	}

	#header.is-active .hamburger-inner,
	#header.is-active .hamburger-inner::before,
	#header.is-active .hamburger-inner::after {
		background-color: var(--text-color-header);
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
		color: var(--text-color-header);
		display: inline-block;
		font-weight: 700;
		line-height: 1;
		margin-left: 40px;
		text-transform: uppercase;
	}

	#header:has(.hamburger-trigger:checked) .hamburger-label,
	#header.is-active .hamburger-label {
		color: var(--text-color-header);
	}

	#header.is-active .hamburger-label {
		color: var(--text-color-header);
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
		color: var(--text-color-header);
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

	@keyframes fade-in-stagger {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
