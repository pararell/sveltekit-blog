<script>
	export let blogs = [];
	export let category;
	$: blogsToShow = blogs
		.filter((blog) => (category ? blog.categories.includes(category) : true))
		.sort((a, b) => new Date(b.Created) - new Date(a.Created));
</script>

{#if blogsToShow}
	{#each blogsToShow as blog (blog.id)}
		<a class="card" rel="prefetch" href="/blogs/{blog.slug}">
			<div class="card-left">
				<div class="card-left-top">
					<div class="thumbnail">
						<img class="card-left-img" alt={blog.slug} src={blog.imgLink} loading="lazy" />
					</div>
				</div>
				<div class="card-left-bottom">
					<p class="date">{new Date(blog.date).toLocaleDateString()}</p>
				</div>
			</div>

			<div class="card-right">
				<h2>{blog.title}</h2>
				<div class="separator" />
				<p>
					{blog.description}
				</p>
			</div>
		</a>
	{/each}
{/if}

<style>
	.card {
		position: relative;
		font-family: 'Nunito', sans-serif;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 80px auto;
		background-color: #fff;
		box-shadow: 1px 1px 20px 0px rgb(0 0 0 / 15%);
		cursor: pointer;
	}

	.thumbnail {
		position: relative;
		display: flex;
		top: -30px;
		height: 320px;
		overflow: hidden;
		box-shadow: 1px 1px 20px 0px rgb(0 0 0 / 15%);
		transition: all 0.1s ease-out;
	}

	.card:hover {
		opacity: 1;
		text-decoration: none;
	}

	.card:hover .thumbnail {
		transform: translateX(10px);
	}

	.card-left-img {
		object-fit: cover;
		object-position: center;
		display: block;
		width: 100%;
	}

	.card-left {
		flex: 1;
		min-width: 250px;
	}

	.card-left-bottom {
		margin-top: -25px;
		padding-left: 10px;
	}

	.card-right {
		flex: 1;
		margin-left: 20px;
		margin-right: 20px;
		min-width: 250px;
	}

	h2 {
		padding-top: 15px;
		font-size: 1.3rem;
		color: var(--text-color);
	}
	.separator {
		margin-top: 10px;
		border: 1px solid var(--secondary-color);
	}

	p {
		text-align: justify;
		padding-top: 10px;
		font-size: 0.95rem;
		line-height: 150%;
		color: var(--text-color);
	}

	.date {
		font-size: 1rem;
		line-height: 1.2;
		padding: 0;
	}
</style>
