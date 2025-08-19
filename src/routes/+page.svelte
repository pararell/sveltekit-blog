<script>
	import { page } from '$app/state';

	import { afterNavigate } from '$app/navigation';

	afterNavigate(() => {
		const scriptsJs = document.querySelectorAll('[script-from-html]');
		if (scriptsJs?.length > 0) {
			scriptsJs.forEach((scriptJs) => {
				const newScript = document.createElement('script');
				newScript.textContent = scriptJs.textContent;
				newScript.setAttribute('type', 'text/javascript');
				newScript.setAttribute('src', scriptJs.getAttribute('src'));

				document.head.appendChild(newScript);
			});
		}
	});
</script>

<svelte:head>
	<title>{page.data?.home?.metaTitle}</title>
</svelte:head>

{#if page.data.home}
	<div class="homePage">
		{@html page.data.home.content}
	</div>
{/if}
