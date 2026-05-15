<script lang="ts">
  import { onMount } from "svelte";
  import { EditorState } from "@codemirror/state";
  import { EditorView, keymap, lineNumbers } from "@codemirror/view";
  import { markdown } from "@codemirror/lang-markdown";
  import livePreview from "./livePreview";

  let el: HTMLDivElement;

  onMount(() => new EditorView({
    parent: el,
    state: EditorState.create({
      doc: "Hello World",
      extensions: [
        lineNumbers(),
        markdown(),
        livePreview,
        EditorView.theme({ "&": { height: "100%", fontSize: "16px" } })
      ]
    })
  }));
</script>

<div bind:this={el} style="height:100vh" />