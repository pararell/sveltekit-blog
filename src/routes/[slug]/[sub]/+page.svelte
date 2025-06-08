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
	<title>{$page.data?.subPageWithContent?.metaTitle}</title>
</svelte:head>

{#if $page.data?.subPageWithContent}
	{@html $page.data.subPageWithContent.content}
{/if}
