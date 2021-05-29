<script context="module">
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('about_title')}</title>
</svelte:head>

<div class="content">
	<h1>{$_('about_title')}</h1>

	<p>
		{$_('about_description')}
	</p>

</div>

<style>
	.content {
		max-width: var(--column-width);
		margin: 0 auto 0 auto;
	}
	p {
		line-height: 2;
	}
</style>
