<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";

	let files: string[] = [];
	let content;

	async function loadFolder() {
		const folder = await invoke<string | null>("open_folder");

		if (!folder) return;

		files = await invoke<string[]>("read_folder", {
			path: folder
		});
	}

	async function loadFile(path: string) {
		content = await invoke<string>("read_file", {
			path: path
		});
		console.log(content);
	}

</script>

<button on:click={loadFolder}>
	Open Folder
</button>

{#if files.length > 0}
	<ul>
		{#each files as file (file)}
			<li>
				<button on:click={() => loadFile(file)}>
					{file}
				</button>
			</li>
		{/each}
	</ul>
{/if}
