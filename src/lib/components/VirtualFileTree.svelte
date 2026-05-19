<script lang="ts">
	import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	type TreeNode = {
		name: string;
		path: string;
		type: 'file' | 'folder';
		children?: TreeNode[];
	};

	type FlatRow = {
		node: TreeNode;
		depth: number;
	};

	export let rows: FlatRow[];
	export let loadFile: (path: string) => Promise<void>;
	export let toggleFolder: (path: string) => void;

	const ROW_HEIGHT = 32; // px — must match the Button height
	const OVERSCAN = 5;    // extra rows above/below viewport

	let viewportHeight = 0;
	let scrollTop = 0;

	$: totalHeight = rows.length * ROW_HEIGHT;

	$: startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
	$: endIndex = Math.min(
		rows.length,
		Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN
	);
	$: visibleRows = rows.slice(startIndex, endIndex);
	$: offsetY = startIndex * ROW_HEIGHT;

	function onScroll(e: Event) {
		scrollTop = (e.currentTarget as HTMLElement).scrollTop;
	}

	// A folder is open if its children appear in the flat list right after it
	function isOpen(row: FlatRow, index: number): boolean {
		if (row.node.type !== 'folder') return false;
		const next = rows[rows.indexOf(row) + 1]; // indexOf is fine — visibleRows is small
		return !!next && next.depth > row.depth;
	}
</script>

<div
	role="tree"
	class="relative flex-1 overflow-y-auto"
	style="height: 100%"
	bind:clientHeight={viewportHeight}
	on:scroll={onScroll}
>
	<!-- Full-height spacer so the scrollbar reflects total content -->
	<div style="height: {totalHeight}px; position: relative;">
		<div style="position: absolute; top: {offsetY}px; width: 100%;">
			{#each visibleRows as row (row.node.path)}
				<div
					style="height: {ROW_HEIGHT}px; padding-left: {row.depth * 16}px;"
					class="flex items-center"
				>
					{#if row.node.type === 'folder'}
						{@const open = isOpen(row, 0)}
						<Button
							variant="ghost"
							class="h-8 w-full justify-start gap-1 px-1 text-sm"
							onclick={() => toggleFolder(row.node.path)}
						>
							{#if open}
								<ChevronDown class="h-4 w-4 shrink-0" />
								<FolderOpen class="h-4 w-4 shrink-0" />
							{:else}
								<ChevronRight class="h-4 w-4 shrink-0" />
								<Folder class="h-4 w-4 shrink-0" />
							{/if}
							<span class="truncate">{row.node.name}</span>
						</Button>
					{:else}
						<Button
							variant="ghost"
							class="h-8 w-full justify-start gap-1 px-1 text-sm"
							onclick={() => loadFile(row.node.path)}
						>
							<File class="h-4 w-4 shrink-0" />
							<span class="truncate">{row.node.name}</span>
						</Button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>