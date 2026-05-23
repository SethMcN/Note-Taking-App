<!-- TODO(explorer): Extract buildTree and walkFolders into dedicated utils; move tree state to store. -->
<!-- TODO(explorer): Use explorer store for openFolders state instead of local Set. -->
<!-- TODO(explorer): Abstract Tauri invocations through filesystem layer. -->
<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import { Button } from '$lib/components/ui/button';
	import VirtualFileTree from '$lib/features/explorer/components/VirtualTree.svelte';
	import {
		ListChevronsUpDown,
		ArrowDownAZ,
		ArrowUpZA,
		CalendarArrowDown,
		CalendarArrowUp
	} from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

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

	function flatten(nodes: TreeNode[], depth = 0): FlatRow[] {
		const rows: FlatRow[] = [];
		for (const node of nodes) {
			rows.push({ node, depth });
			if (node.type === 'folder' && openFolders.has(node.path) && node.children) {
				rows.push(...flatten(node.children, depth + 1));
			}
		}
		console.log(rows);
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
<Sidebar.Root>
	<Sidebar.Header class="border-b px-3 py-2">
		<div class="mb-2 flex items-center justify-between">
			<span class="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
				Explorer
			</span>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="ghost" size="icon" class="h-7 w-7" onclick={toggleAll}>
						<ListChevronsUpDown class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Toggle all folders</Tooltip.Content>
			</Tooltip.Root>
		</div>

		<Button variant="default" class="w-full" onclick={openFolder}>
			Open Folder
		</Button>

		<div class="mt-2 flex items-center gap-0.5">
			<span class="mr-1 text-xs text-muted-foreground">Sort</span>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="ghost" size="icon" class="h-7 w-7">
						<ArrowDownAZ class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Sort A-Z</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="ghost" size="icon" class="h-7 w-7">
						<ArrowUpZA class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Sort Z-A</Tooltip.Content>
			</Tooltip.Root>

			<div class="mx-1 h-4 w-px bg-border" />

			<span class="mr-1 text-xs text-muted-foreground">Date</span>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="ghost" size="icon" class="h-7 w-7">
						<CalendarArrowDown class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Newest first</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="ghost" size="icon" class="h-7 w-7">
						<CalendarArrowUp class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Oldest first</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<VirtualFileTree rows={flatRows} {loadFile} {toggleFolder} />
	</Sidebar.Content>

	<Sidebar.Footer />
</Sidebar.Root>