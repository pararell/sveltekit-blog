<script>
	import { page } from '$app/stores';
	import { api } from '$lib/api';
	import { _, locale, locales } from 'svelte-i18n';
	import { blogs } from '$lib/store/store';
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fromEvent } from 'rxjs';

	const dispatch = createEventDispatcher();

	let selected;
	export let active = '';

	locale.subscribe((value) => {
		selected = value;
	});

	const toggleMenu = () => {
		dispatch('toggle');
	};

	const handleLanguageChange = async () => {
		locale.set(selected);
		const langSet = await api('api/lang', { method: 'POST' }, { lang: selected });
		if (langSet) {
			const resBlogs = await api('api/blogs');
			if (resBlogs) {
				blogs.next(resBlogs.body);
				goto('/blogs');
				return;
			}
			return;
		}

		return {
			error: new Error()
		};
	};

	onMount(() => {
		fromEvent(document.getElementById('main'), 'click').subscribe(() => {
			dispatch('toggle', {
				action: 'close'
			});
		});
	});
</script>

<header id="header" role="banner" class={active}>
	<div class="container">
		<div class="header-menu">
			<a sveltekit:prefetch href="/" class="logo">T</a>
			<a class="menu-link" class:active={$page.path === '/blogs'} sveltekit:prefetch href="/blogs"
			>Blog</a
		>
			<div class="menu-links">
				<button class="hamburger hamburger--boring {active}" on:click={toggleMenu} type="button">
					<span class="hamburger-box">
						<span class="hamburger-inner" />
					</span>
					<span class="hamburger-label">Menu</span>
				</button>
			</div>
			<form id="header-search" style="opacity: 0;width:1px;">
				<input
					type="search"
					name="s"
					placeholder="{$_('search')}&hellip;"
					class="draw"
				/>
				<button type="submit">&rarr;</button>
			</form>
		</div>

		<nav id="site-nav" role="navigation" class={active}>
			<div class="col">
				<h4>T</h4>
				<ul>
					<li class:active={$page.path === '/'}>
						<a sveltekit:prefetch href="/">{$_('home')}</a>
					</li>
					<li class:active={$page.path === '/about'}>
						<a sveltekit:prefetch href="/about">{$_('about')}</a>
					</li>
					<li class:active={$page.path === '/blogs'}>
						<a sveltekit:prefetch href="/blogs">Blog</a>
					</li>
					<li class:active={$page.path === '/contact'}>
						<a sveltekit:prefetch href="/contact">{$_('contact')}</a>
					</li>
				</ul>
			</div>
			<div class="col">
				<h4>Blog</h4>
				<ul>
					{#each $blogs as blog}
						<li><a href="/blogs/{blog.slug}">{blog.title}</a></li>
					{/each}
				</ul>
			</div>
			<div class="col">
				<div class="switcher">
					<!-- svelte-ignore a11y-no-onchange -->
					<select bind:value={selected} on:change={handleLanguageChange}>
						{#each $locales as language}
							<option value={language}>
								{language}
							</option>
						{/each}
					</select>
				</div>
			</div>
		</nav>
	</div>
</header>

<style>

	.logo {
		color: #FFF;
		font-weight: 700;
		font-size: 69px;
		line-height: 1;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 20px;
	}

	.logo:hover {
		text-decoration: none;
	}

	.header-menu {
		margin: 0 0 0 auto;
		display: flex;
		align-items: center;
	}

	.menu-links {
		margin-left: auto;
		margin-right: 0;
	}

	.menu-link {
		color: #fff;
		font-weight: 600;
		letter-spacing: 0.08em;
		line-height: 1;
		padding: 0 1em;
		display: inline-block;
	}
	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 10%;
		text-decoration: none;
		transition: color 0.2s linear;
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

	#header {
		position: relative;
	}

	#header.is-active {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
		background: #fff;
		overflow: auto;
		min-height: 300px;
	}

	@media screen and (max-width: 768px) {
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
		width: 30px;
		height: 24px;
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

	.hamburger--boring .hamburger-inner,
	.hamburger--boring .hamburger-inner::before,
	.hamburger--boring .hamburger-inner::after {
		transition-property: none;
	}

	.hamburger--boring.is-active .hamburger-inner {
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	.hamburger--boring.is-active .hamburger-inner::before {
		top: 0;
		opacity: 0;
	}

	.hamburger--boring.is-active .hamburger-inner::after {
		bottom: 0;
		-webkit-transform: rotate(-90deg);
		transform: rotate(-90deg);
	}

	.hamburger-label {
		color: #fff;
		display: inline-block;
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 1;
		margin-left: 0.3125em;
		text-transform: uppercase;
	}

	#header.is-active .hamburger-label {
		color: #000;
	}

	.hamburger-box,
	.hamburger-label {
		display: inline-block;
		vertical-align: middle;
	}

	#site-nav {
		clear: both;
		display: flex;
		flex-direction: column;
		height: 0;
		overflow: hidden;
		padding-top: 1em;
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
	}

	#site-nav ul {
		list-style-type: none;
		margin-top: 1em;
	}

	#site-nav li {
		margin-bottom: 0.3125em;
	}

	#site-nav li a {
		color: #b4b9ba;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	#site-nav li a:hover,
	#site-nav li a:focus {
		color: #686d6e;
	}

	#header-search {
		margin: 0.6em 0 0.6em 2em;
		max-width: 10em;
		position: relative;
		-webkit-appearance: none;
	}

	#header-search input {
		background: transparent;
		border: none;
		border-color: #fff;
		color: #fff;
		border-style: solid;
		border-width: 1px;
		border-radius: 50px;
		outline: none;
		width: 100%;
		padding: 0.5em 1em 0.4em 1em;
		transition: border-color 0.3s ease;
		-webkit-appearance: none;
		line-height: 1;
		font-size: 14px;
	}

	#header-search input::-webkit-search-cancel-button {
		display: none;
	}

	#header-search button {
		background: none;
		border: none;
		color: #fff;
		font-size: 1em;
		padding: 0;
		position: absolute;
		top: 50%;
		right: 0.75em;
		transform: translateY(-50%);
		-webkit-appearance: none;
	}

	#header.is-active #header-search button {
		color: #b4b9ba;
	}

	#header.is-active #header-search input {
		border-color: #b4b9ba;
	}

	#header-search ::-webkit-input-placeholder {
		color: #fff;
	}

	#header-search :-moz-placeholder {
		color: #fff;
		opacity: 1;
	}

	#header-search ::-moz-placeholder {
		color: #fff;
		opacity: 1;
	}

	#header-search :-ms-input-placeholder {
		color: #fff;
	}

	#header.is-active #header-search ::-webkit-input-placeholder {
		color: #b4b9ba;
	}

	#header.is-active #header-search :-moz-placeholder {
		color: #b4b9ba;
		opacity: 1;
	}

	#header.is-active #header-search ::-moz-placeholder {
		color: #b4b9ba;
		opacity: 1;
	}

	#header.is-active #header-search :-ms-input-placeholder {
		color: #b4b9ba;
	}

	#header .col {
		opacity: 0;
	}

	#header.is-active .col {
		transform: translateY(40px);
		transition: opacity 0.3s ease;
		animation: fade-in-stagger 0.8s ease forwards;
	}

	#header.is-active .col:nth-child(1) {
		-webkit-animation-delay: 0;
	}

	#header.is-active .col:nth-child(2) {
		-webkit-animation-delay: 0.1s;
	}

	#header.is-active .col:nth-child(3) {
		-webkit-animation-delay: 0.2s;
	}

	#header.is-active .col:nth-child(4) {
		-webkit-animation-delay: 0.3s;
	}

	#header.is-active .col:nth-child(5) {
		-webkit-animation-delay: 0.4s;
	}

	@keyframes fade-in-stagger {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
