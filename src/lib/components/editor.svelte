<script lang="ts">
	import { onMount } from 'svelte';

	import { EditorState } from '@codemirror/state';

	import {
		EditorView,
		keymap,
		lineNumbers,
	} from '@codemirror/view';

	import {
		defaultKeymap,
		history,
		historyKeymap,
		indentWithTab

	} from '@codemirror/commands';

	import { markdown } from '@codemirror/lang-markdown';

	let editorElement: HTMLDivElement;

	let editorView: EditorView;

	onMount(() => {
		const state = EditorState.create({
			doc: '# Hello\n\nStart writing...',
			extensions: [
				lineNumbers(),

				history(),

				keymap.of([
					...defaultKeymap,
					...historyKeymap,
					...[indentWithTab]
				]),

				markdown(),

				EditorView.theme({
					'&': {
						height: '100%'
					},

					'.cm-content': {
						padding: '1rem',
						fontSize: '16px',
						fontFamily: 'Inter, sans-serif'
					},

					'.cm-focused': {
						outline: 'none'
					}
				})
			]
		});

		editorView = new EditorView({
			state,
			parent: editorElement
		});

		return () => {
			editorView.destroy();
		};
	});
</script>

<div class="editor" bind:this={editorElement}></div>

<style>
	.editor {
		height: 100vh;
	}
</style>