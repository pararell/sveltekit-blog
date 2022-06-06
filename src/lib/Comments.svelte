<script>
  import { onMount } from "svelte";
  import { setDisqus, resetDisqus } from '$lib/utils';
  import { config, disqusLoaded } from '$lib/store';
  import { filter, map, mergeMap, take } from 'rxjs';
  export let host;
	export let slug;

  onMount(() => {
		config
			.pipe(
				mergeMap((config) =>
					disqusLoaded.pipe(
						filter((disqusLoaded) => !disqusLoaded),
						map(() => config)
					)
				),
				filter((config) => config && config.disqusSrc),
				take(1)
			)
			.subscribe((config) => {
				setDisqus(config)
					.pipe(take(1))
					.subscribe(() => {
						disqusLoaded.next(true);
					});
			});

		disqusLoaded.pipe(filter(Boolean), take(1)).subscribe(() => {
				resetDisqus({host, slug});
		});
	});
</script>


<div id="disqus_thread" />