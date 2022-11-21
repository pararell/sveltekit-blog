<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data?.subPageWithContent?.metaTitle}</title>
</svelte:head>

{#if $page.data?.subPageWithContent}
	{@html $page.data.subPageWithContent.content}
{/if}
