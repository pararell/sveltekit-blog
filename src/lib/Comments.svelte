<script>
	import { onDestroy, onMount } from 'svelte';
	import { setDisqus } from '$lib/utils';
	import { page } from '$app/stores';
	import { disqusLoaded } from './store';
	import { browser } from '$app/environment';

	export let host;
	export let slug;

if(browser) {
	const unsubscribe = page.subscribe((pVal) => {
			disqusLoaded.subscribe((loaded) => {
				if (pVal.data.config) {
					setDisqus(pVal.data.config, host, slug);
					disqusLoaded.set(true);
				}
			});
		});


	onDestroy(unsubscribe);
}

	
</script>

<div id="disqus_thread" />
