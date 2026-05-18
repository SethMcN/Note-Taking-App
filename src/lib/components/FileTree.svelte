<script lang="ts">
	export let node;
	export let loadFile: (path: string) => void;

	let open = false;
</script>

<div>
	{#if node.type === "folder"}
		<button
			class="block w-full text-left hover:bg-zinc-800 px-2 py-1 rounded"
			on:click={() => (open = !open)}
		>
			📁 {node.name}
		</button>

		{#if open}
			<div class="ml-4 border-l pl-2">
				{#each node.children as child (child.path)}
					<svelte:self node={child} {loadFile} />
				{/each}
			</div>
		{/if}
	{:else}
		<button
			class="block w-full text-left hover:bg-zinc-800 px-2 py-1 rounded"
			on:click={() => loadFile(node.path)}
		>
			📄 {node.name}
		</button>
	{/if}
</div>