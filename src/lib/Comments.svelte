<script>
	import { setDisqus } from '$lib/utils';

	export let host;
	export let slug;

	onMount(() => {
		setDisqus(host, slug);
	})

</script>

<div id="disqus_thread" />
