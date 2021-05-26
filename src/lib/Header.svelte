<script>
	import { page } from '$app/stores';
	import { api } from '$lib/api';
	import { _, locale, locales } from 'svelte-i18n';
	import { blogs } from '$lib/store/store';
	import { goto } from '$app/navigation';
	// import logo from './svelte-logo.svg';

	let selected;
	let open = '';

	locale.subscribe((value) => {
		selected = value;
	});

    page.subscribe(() => {
        open = '';
    });

	const toggleMenu = async () => {
		if (open === 'is-active') {
			open = '';
		} else {
			open = 'is-active';
		}
	};

	const handleSubmit = async (pageObj) => {
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
</script>

<header id="masthead" role="banner" class={open}>
	<div class="container">
		<button class="hamburger hamburger--boring {open}" on:click={toggleMenu} type="button">
			<span class="hamburger-box">
				<span class="hamburger-inner" />
			</span>
			<span class="hamburger-label">Menu</span>
		</button>
		<form id="masthead-search">
			<input
				type="search"
				name="s"
				aria-labelledby="search-label"
				placeholder="Search&hellip;"
				class="draw"
			/>
			<button type="submit">&rarr;</button>
		</form>
		<nav id="site-nav" role="navigation" class={open}>
			<div class="col">
				<h4>Navigation</h4>
				<ul>
					<li class:active={$page.path === '/'}>
                        <a sveltekit:prefetch href="/">{$_('home')}</a>
                    </li>
					<li class:active={$page.path === '/about'}>
						<a sveltekit:prefetch href="/about">{$_('about')}</a>
					</li>
					<li class:active={$page.path === '/blogs'}>
						<a sveltekit:prefetch href="/blogs">Blogs</a>
					</li>
				</ul>
			</div>
			<div class="col">
				<h4>Languages</h4>

				<div class="corner">
					<select bind:value={selected} on:change={() => handleSubmit($page)}>
						{#each $locales as language}
							<option value={language}>
								{language}
							</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="col">
				<h4>Blogs</h4>
				<ul>
                    {#each $blogs as blog}
                    <li><a href="/blogs/{blog.slug}">{blog.title}</a></li>
                    {/each}
	
				</ul>
			</div>
			<div class="col">
				<h4>Contact</h4>
				<ul>
					<li><a href="#">Contact</a></li>
				</ul>
			</div>
			<div class="col">
				<ul class="social">
					<li><a href=""><svg title="Facebook"><use xlink:href="#icon-facebook" /></svg></a></li>
					<li><a href=""><svg title="Twitter"><use xlink:href="#icon-twitter" /></svg></a></li>
					<li><a href=""><svg title="LinkedIn"><use xlink:href="#icon-linkedin" /></svg></a></li>
				</ul>
			</div>
		</nav>
	</div>
</header>

<style>
	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 10%;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
