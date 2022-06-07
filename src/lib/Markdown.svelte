<script>
	import marked from 'marked';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let content = '# Subtitle';

	$: markdown = marked(content);
</script>

<div class="markdown-editor">
	<div class="markdown-editor__right-panel">
		<div class="markdown-editor__output">{@html markdown}</div>
	</div>
	<div class="markdown-editor__left-panel">
		<textarea name="content" bind:value={content} class="markdown-editor__source" />
	</div>
</div>

<style>

	.markdown-editor {
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-evenly;
	}

	.markdown-editor__left-panel,
	.markdown-editor__right-panel {
		width: 50%;
		box-shadow: 0px 0px 4px #ccc;
		border: 1px solid rgba(0, 0, 0, 0.1);
		height: 85vh;
	}

	.markdown-editor__right-panel {
		overflow: auto;
	}

	.markdown-editor__source {
		border: none;
		width: 100%;
		height: 99%;
	}

	.markdown-editor__source:focus {
		outline: none;
	}

	.markdown-editor__output {
		width: 100%;
		padding: 0 2em;
	}
</style>
