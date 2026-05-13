<script lang="ts">
  // import { invoke } from '@tauri-apps/api/core';
  import Tiptap from '$lib/Tiptap.svelte'


</script>

<main>
  <Tiptap />
</main>




<!-- <button onclick={() => invoke<string>('greet', { name: name }).then(r => result = r)}>
  Call Rust
</button>

<input type="text" bind:value={name} placeholder="Enter your name" />

<p>{result}</p> -->