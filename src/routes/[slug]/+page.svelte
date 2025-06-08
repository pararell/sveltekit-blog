<script>
	import { page } from '$app/stores';

	import { afterNavigate } from '$app/navigation';

	afterNavigate(() => {
		const scriptsJs = document.querySelectorAll('[script-from-html]');
		if (scriptsJs?.length > 0) {
			scriptsJs.forEach((scriptJs) => {
				const newScript = document.createElement('script');
				newScript.textContent = scriptJs.textContent;
				document.head.appendChild(newScript);
			});
		}
	});
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
