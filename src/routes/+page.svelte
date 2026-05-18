<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";

	import * as ScrollArea from "$lib/components/ui/scroll-area";

	import FileTree from "$lib/components/FileTree.svelte";

	type FileEntry = {
		name: string;
		full_path: string;
	};

	type TreeNode = {
		name: string;
		path: string;
		type: "file" | "folder";
		children?: TreeNode[];
	};

	let tree: TreeNode[] = [];

	let content = "";

	function buildTree(files: FileEntry[]) {
		const root: TreeNode[] = [];

		for (const file of files) {
			const parts = file.name.split("/");

			let current = root;

			parts.forEach((part, index) => {
				const isFile = index === parts.length - 1;

				let existing = current.find((n) => n.name === part);

				if (!existing) {
					existing = {
						name: part,
						path: file.full_path,
						type: isFile ? "file" : "folder",
						children: isFile ? undefined : []
					};

					current.push(existing);
				}

				if (existing.children) {
					current = existing.children;
				}
			});
		}

		return root;
	}

	async function openFolder() {
		const folder = await invoke<string | null>("open_folder");

		if (!folder) return;

		const files = await invoke<FileEntry[]>("read_folder", {
			path: folder
		});

		tree = buildTree(files);
	}

	async function loadFile(path: string) {
		content = await invoke<string>("read_file", {
			path
		});
	}
</script>

<div class="flex h-screen">
	<!-- Sidebar -->
	<div class="w-80 border-r flex flex-col">
		<div class="p-2 border-b">
			<button
				class="w-full rounded bg-zinc-800 px-3 py-2 hover:bg-zinc-700"
				on:click={openFolder}
			>
				Open Folder
			</button>
		</div>

		<ScrollArea.Root class="flex-1">
			<div class="p-2">
				{#each tree as node (node.path)}
					<FileTree {node} {loadFile} />
				{/each}
			</div>
		</ScrollArea.Root>
	</div>

	<!-- Editor -->
	<div class="flex-1 overflow-auto p-4">
		<pre>{content}</pre>
	</div>
</div>