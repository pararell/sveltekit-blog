<script>
	import { page } from '$app/stores';
	import { api } from '$lib/api';
	// import logo from './svelte-logo.svg';
	import { _, locale, locales } from 'svelte-i18n';
	import { blogs } from '$lib/store/store';
    import { goto } from '$app/navigation';


	let selected;
	locale.subscribe((value) => {
		selected = value;
	});

	const handleSubmit = async () => {
		locale.set(selected);
		const langSet = await api('api/lang', { method: 'POST' }, { lang: selected });

		if (langSet) {
			const resBlogs = await fetch('/blogs.json');
			if (resBlogs.ok) {
				const blogsFromApi = await resBlogs.json();
				blogs.next(blogsFromApi);
                goto('/blogs')
				return;
			}
			return;
		}

		return {
			error: new Error()
		};
	};
</script>

<header>
	<div class="corner">
		<!-- <a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a> -->
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">{$_('home')}</a></li>
			<li class:active={$page.path === '/about'}>
				<a sveltekit:prefetch href="/about">{$_('about')}</a>
			</li>
			<li class:active={$page.path === '/blogs'}><a sveltekit:prefetch href="/blogs">Blogs</a></li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<select bind:value={selected} on:change={handleSubmit}>
			{#each $locales as language}
				<option value={language}>
					{language}
				</option>
			{/each}
		</select>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

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
