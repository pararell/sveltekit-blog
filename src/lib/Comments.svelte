<script>
	import { setDisqus } from '$lib/utils';
	import { onMount } from 'svelte';

	export let host;
	export let slug;

	onMount(() => {
		setDisqus(host, slug);
	})

</script>

<div id="disqus_thread" />
