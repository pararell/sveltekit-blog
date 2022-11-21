<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data?.home?.metaTitle}</title>
</svelte:head>

{#if $page.data.home}
	<div class="homePage">
		{@html $page.data.home.content}
	</div>
{/if}
