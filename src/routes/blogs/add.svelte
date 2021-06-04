<script>
	import Markdown from '$lib/Markdown.svelte';
	import { api } from '$lib/api';
	import { blogs } from '$lib/store/store';

	const handleRedirect = async (event) => {
		const resBlogs = await api({resource: 'api/blogs', serverFetch:fetch});

		if (resBlogs) {
			blogs.next(resBlogs.body)
		}
	}
</script>

<Markdown on:redirectAction={handleRedirect} />
