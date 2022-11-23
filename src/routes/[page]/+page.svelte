<script>
	import { page } from '$app/stores';
	export let form;
</script>

<svelte:head>
	<title>{$page.data?.pageWithContent?.metaTitle}</title>
</svelte:head>

{#if $page.data?.pageWithContent}
	{@html $page.data.pageWithContent.content}

	{#if $page.data?.paramsPage === 'contact'}
		{#await import('$lib/ContactForm.svelte') then ContactForm}
			<div class="container">
				<ContactForm.default />
			</div>
		{/await}
	{/if}
{/if}
