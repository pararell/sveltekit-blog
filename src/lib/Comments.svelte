<script>
	import { setDisqus } from '$lib/utils';
	import { onMount } from 'svelte';

	export let host;
	export let slug;
	export let disqusUrl;

	onMount(() => {
		setDisqus(host, slug, disqusUrl);
	});
</script>

<div id="disqus_thread" />
