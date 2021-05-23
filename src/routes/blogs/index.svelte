<script context="module">
	import { blogs } from '$lib/store/store';

	export const load = async ({ fetch }) => {
		const res = await fetch('/blogs.json');

		if (res.ok) {
			const blogsFromApi = await res.json();
			blogs.next(blogsFromApi);

			return {
				props: { blogsFromApi },
				maxage: 0
			};
		}

		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<h1>Blog</h1>

<div class="row">
	{#each $blogs as blog (blog.id)}
		<a class="post" rel="prefetch" href="blogs/{blog.slug}">
			<h2 class="blog-title">{blog.title}</h2>
			<span class="date">{new Date(blog.date).toLocaleDateString()}</span>
		</a>
	{/each}
</div>

<style>
	h1 {
		font-family: 'Josefin Sans', cwtexyen, sans-serif;
		margin-bottom: 20px;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		width: 100%;
		margin: 0 0 0 -1em;
	}

	.post {
		margin: 0 0 25px 2em;
		transition: all 0.1s ease-out;
		font-family: 'Josefin Sans', cwtexyen, sans-serif;
		width: 16em;
		text-decoration: none;
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.1);
		padding: 15px;
		border-radius: 6px;
		background: #13293d;
	}

	.post:hover {
		transform: translateX(10px);
	}

	.blog-title {
		text-decoration: none;
		font-family: 'Josefin Sans', cwtexyen, sans-serif;
		font-size: 20px;
		line-height: 1.2;
		color: #fff;
	}

	.date {
		color: #222;
		display: block;
		font-weight: 300;
		font-size: 16px;
		color: #e8f1f2;
	}

	img {
		object-fit: cover;
		border-radius: 50%;
		overflow: hidden;
		height: 150px;
		width: 150px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		display: block;
		margin: 0 auto 10px auto;
	}
</style>
