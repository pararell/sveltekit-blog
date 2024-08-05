<script>
	import { setDisqus } from '$lib/utils';
	import { onMount } from 'svelte';

	let { host, slug, disqusUrl } = $props();

	onMount(() => {
		setDisqus(host, slug, disqusUrl);
	});
</script>

<div id="disqus_thread" ></div>
