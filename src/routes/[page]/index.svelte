<script context="module">
    import { pageWithContent, user } from '$lib/store';

	export const load = async ({ fetch, url, params }) => {
		const res = await fetch(`/${params.page}/${params.page}.json`);

		if (res.ok) {
			const pageFromApi = await res.json();
			pageWithContent.next(pageFromApi);
			return { props: { url, params } };
		}

		return {
			props: {
				url,
				params
			}
		};
	};
</script>

<script>
    import marked from 'marked';
    import Markdown from '$lib/Markdown.svelte';
    import { api } from '$lib/api';
    import { ADMIN_EMAIL } from '$lib/constants';
import { take, filter } from 'rxjs';

    export let title = '';
    export let metaTitle = '';
    export let image = '';
    export let description = '';
    export let position = '';
    export let id = '';
    export let url = '';
    export let content = '#Title';
    let error = '';

    pageWithContent.pipe(filter(Boolean),take(1)).subscribe((pageFound) => {
	    title = pageFound.title;
      metaTitle = pageFound.title;
      url = pageFound.url;
      image = pageFound.imgLink;
      description = pageFound.description;
      id = pageFound.id;
      content = pageFound.content;
	});

    const submitForm = async () => {
		if (title && id) {
			const data = {
        id: parseFloat(id),
				title,
        url,
        metaTitle,
        position,
				slug: title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-'),
				description,
				image,
				content
			};

			const res = await api({ url: `api/pages/update`, method: 'PATCH', data });
			pageWithContent.next(res.body);
		}
	};

</script>

<svelte:head>
	<title>{$pageWithContent?.title}</title>
</svelte:head>

{#if $pageWithContent}
<div class="container">
	<div class="content">
		{@html marked($pageWithContent.content)}
	</div>
</div>

{#if $user?.Email === ADMIN_EMAIL}
	<form on:submit|preventDefault={submitForm} class="new">
		<h1 class="header-title">Add blog</h1>
		<div class="header-cta">
			<input type="text" name="title" bind:value={title} placeholder="Title" />
      <input type="text" name="metaTitle" bind:value={metaTitle} placeholder="MetaTitle" />
      <input type="text" name="url" bind:value={url} placeholder="Url" />
			<input type="text" name="image" bind:value={image} placeholder="Image link" />
      <input type="number" name="position" bind:value={position} placeholder="Position" />
			<input type="text" name="description" bind:value={description} placeholder="Description" />
			<button class="btn submit" disabled={!title || !url || !content}> Save</button>
		</div>
		{#if error}
			<p class="error">
				{error}
			</p>
		{/if}

      <Markdown bind:content={content}  />
    </form>
  {/if}
{/if}

<style>
	.content {
		margin: 2rem 0 4rem 0;
	}

	.content :global(h2) {
		font-size: 1.6rem;
		font-weight: 600;
		color: #000;
	}

	.content :global(p) {
		font-size: 1.2rem;
		text-align: justify;
	}

	.content :global(pre) {
		background-color: #f9f9f9;
		box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
		padding: 0.5em;
		border-radius: 2px;
		overflow-x: auto;
	}

	.content :global(pre) :global(code) {
		background-color: transparent;
		padding: 0;
	}

	.content :global(ul) {
		line-height: 1.5;
	}

	.content :global(li) {
		margin: 0 0 0.5rem 0;
		font-size: 1.2rem;
	}

	.date {
		text-align: right;
		margin-right: 0;
		margin-left: auto;
		display: block;
		color: var(--secondary-color);
	}

	.header-title {
		margin: 0 0 10px 0;
		text-align: center;
	}

	.header-cta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
		position: relative;
	}

	input {
		min-width: 50%;
		border-radius: 4px;
		padding: 0 10px;
		box-shadow: 0px 0px 4px #ccc;
		border: 1px solid transparent;
		min-height: 35px;
		outline: none;
		margin-right: 15px;
	}
</style>

