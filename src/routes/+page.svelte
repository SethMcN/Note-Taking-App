<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import * as ScrollArea from '$lib/components/ui/scroll-area';
	import { Button } from '$lib/components/ui/button';
	import VirtualFileTree from '$lib/components/VirtualFileTree.svelte';
	import { ListChevronsUpDown } from 'lucide-svelte';

	type FileEntry = {
		name: string;
		full_path: string;
		is_dir: boolean;
		size: number;
		created?: number;
		modified?: number;
		accessed?: number;
	};

	type TreeNode = {
		name: string;
		path: string;
		type: 'file' | 'folder';
		children?: TreeNode[];
		size: number;
		created?: number;
		modified?: number;
		accessed?: number;
	};

	// Flat row — what the virtual list actually renders
	type FlatRow = {
		node: TreeNode;
		depth: number;
	};

	let tree: TreeNode[] = [];
	let openFolders = new Set<string>();
	let flatRows: FlatRow[] = [];
	let expanded = false;

	// O(visible) — only flattens what's open, not the whole tree
	function flatten(nodes: TreeNode[], depth = 0): FlatRow[] {
		const rows: FlatRow[] = [];
		for (const node of nodes) {
			rows.push({ node, depth });
			if (node.type === 'folder' && openFolders.has(node.path) && node.children) {
				rows.push(...flatten(node.children, depth + 1));
			}
		}
		return rows;
	}

	function sync() {
		flatRows = flatten(tree);
	}

	function toggleFolder(path: string) {
		if (openFolders.has(path)) {
			openFolders.delete(path);
		} else {
			openFolders.add(path);
		}
		sync();
	}

	function walkFolders(nodes: TreeNode[], cb: (path: string) => void) {
		for (const node of nodes) {
			if (node.type === 'folder') {
				cb(node.path);
				if (node.children) walkFolders(node.children, cb);
			}
		}
	}

	function expandAll() {
		walkFolders(tree, (p) => openFolders.add(p));
		expanded = true;
		sync();
	}

	function collapseAll() {
		openFolders.clear();
		expanded = false;
		sync();
	}

	function toggleAll() {
		expanded ? collapseAll() : expandAll();
	}

	async function openFolder() {
		const folder = await invoke<string | null>('open_folder');
		if (!folder) return;

		const files = await invoke<FileEntry[]>('read_folder', { path: folder });
		tree = buildTree(files);
		openFolders.clear();
		expanded = false;
		content = '';
		sync();
	}

	function buildTree(files: FileEntry[]): TreeNode[] {
		const root: TreeNode[] = [];
		const nodeMap = new Map<string, TreeNode>();

		for (const file of files) {
			const parts = file.name.split('/');
			let current = root;

			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				const isFile = i === parts.length - 1;
				const key = parts.slice(0, i + 1).join('/');
				let existing = nodeMap.get(key);

				if (!existing) {
					existing = {
						name: part,
						path: isFile ? file.full_path : key,
						type: isFile ? 'file' : 'folder',
						children: isFile ? undefined : [],
						size: file.size,
						created: file.created,
						modified: file.modified,
						accessed: file.accessed
					};
					nodeMap.set(key, existing);
					current.push(existing);
				}

				if (existing.children) current = existing.children;
			}
		}

		return root;
	}

	let content = '';

	async function loadFile(path: string) {
		content = await invoke<string>('read_file', { path });
	}
</script>

<div class="flex h-screen">
	<div class="flex w-80 flex-col border-r">
		<div class="flex items-center gap-2 border-b p-2">
			<Button variant="default" onclick={openFolder}>Open Folder</Button>
			<Button variant="outline" size="icon" onclick={toggleAll} aria-label="Toggle all folders">
				<ListChevronsUpDown class="h-4 w-4" />
			</Button>
		</div>

		<!-- Pass flat rows down — no more recursive component tree -->
		<VirtualFileTree rows={flatRows} {loadFile} {toggleFolder} />
	</div>

	<div class="flex-1 overflow-auto p-4">
		<pre>{content}</pre>
	</div>
</div>