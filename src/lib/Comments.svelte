<script>
	import { onDestroy } from 'svelte';
	import { setDisqus } from '$lib/utils';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let host;
	export let slug;

	if (browser) {
		const unsubscribe = page.subscribe((pVal) => {
			if (pVal.data.config) {
				setDisqus(pVal.data.config, host, slug);
			}
		});

		onDestroy(unsubscribe);
	}
</script>

<div id="disqus_thread" />
