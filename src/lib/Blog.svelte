<script>
	import { blogs } from '$lib/store/store';
</script>

{#each $blogs as blog (blog.id)}
	<a class="card" rel="prefetch" href="/blogs/{blog.slug}">
		<div class="card-left">
			<div class="card-left-top">
				<div class="thumbnail">
					<img class="card-left-img" alt="img" src={blog.imgLink} />
				</div>
			</div>
			<div class="card-left-bottom">
				<h6>{new Date(blog.date).toLocaleDateString()} </h6>
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

<style>
	.card {
		position: relative;
		font-family: 'Josefin Sans', cwtexyen, sans-serif;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 80px auto;
		background-color: #fff;
		box-shadow: 1px 1px 20px 0px rgb(0 0 0 / 15%);
		cursor: pointer;
		/* background: #b1bbbc; */
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
		min-width: 300px;
	}

	.card-left-bottom {
		margin-top: -25px;
    	padding-left: 10px;
	}

	.card-right {
		flex: 1;
		margin-left: 20px;
		margin-right: 20px;
		min-width: 300px;
	}

	h2 {
		padding-top: 15px;
		font-size: 1.3rem;
		color: #4b4b4b;
	}
	.separator {
		margin-top: 10px;
		border: 1px solid #c3c3c3;
	}

	p {
		text-align: justify;
		padding-top: 10px;
		font-size: 0.95rem;
		line-height: 150%;
		color: #4b4b4b;
	}

	h6 {
		font-size: 1rem;
		line-height: 1.2;
		color: #c3c3c3;
	}
</style>
