<script lang="ts">
  import { invoke } from '@tauri-apps/api/core';
  let result = $state('');
</script>

<button onclick={() => invoke<string>('greet', { name: 'World' }).then(r => result = r)}>
  Call Rust
</button>
<p>{result}</p>