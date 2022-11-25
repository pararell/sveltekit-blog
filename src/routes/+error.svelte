<script>
	import { page } from '$app/stores';
</script>


<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<h2>{$page.error?.message}</h2>
