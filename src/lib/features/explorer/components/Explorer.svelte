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

	type FlatRow = {
		node: TreeNode;
		depth: number;
	};

	type SortMode =
		| 'name-asc'
		| 'name-desc'
		| 'created-desc'
		| 'created-asc'
		| 'modified-desc'
		| 'modified-asc';

	let sortMode: SortMode = 'name-asc';

	let tree: TreeNode[] = [];
	let openFolders = new Set<string>();
	let flatRows: FlatRow[] = [];
	let expanded = false;

	let content = '';

	/*
	|--------------------------------------------------------------------------
	| Sorting
	|--------------------------------------------------------------------------
	*/

	function sortNodes(nodes: TreeNode[]): TreeNode[] {
		return [...nodes]
			.sort((a, b) => {
				// folders always first
				if (a.type !== b.type) {
					return a.type === 'folder' ? -1 : 1;
				}

				switch (sortMode) {
					case 'name-asc':
						return a.name.localeCompare(b.name);

					case 'name-desc':
						return b.name.localeCompare(a.name);

					case 'created-desc':
						return (b.created ?? 0) - (a.created ?? 0);

					case 'created-asc':
						return (a.created ?? 0) - (b.created ?? 0);

					case 'modified-desc':
						return (b.modified ?? 0) - (a.modified ?? 0);

					case 'modified-asc':
						return (a.modified ?? 0) - (b.modified ?? 0);

					default:
						return 0;
				}
			})
			.map((node) => ({
				...node,

				children: node.children ? sortNodes(node.children) : undefined
			}));
	}

	/*
	|--------------------------------------------------------------------------
	| Flatten Tree
	|--------------------------------------------------------------------------
	*/

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
		const sorted = sortNodes(tree);

		flatRows = flatten(sorted);
	}

	/*
	|--------------------------------------------------------------------------
	| Folder State
	|--------------------------------------------------------------------------
	*/

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

				if (node.children) {
					walkFolders(node.children, cb);
				}
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

	/*
	|--------------------------------------------------------------------------
	| Filesystem
	|--------------------------------------------------------------------------
	*/

	async function openFolder() {
		const folder = await invoke<string | null>('open_folder');

		if (!folder) return;

		const files = await invoke<FileEntry[]>('read_folder', {
			path: folder
		});

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

				if (existing.children) {
					current = existing.children;
				}
			}
		}

		return root;
	}

	async function loadFile(path: string) {
		content = await invoke<string>('read_file', { path });
	}
</script>

<Sidebar.Root>
	<Sidebar.Header class="border-b px-3 py-2">
		<!-- Top Row -->
		<div class="flex items-center justify-between">
			<span
				class="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
			>
				Explorer
			</span>

			<div class="flex items-center">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							variant="ghost"
							size="icon"
							class="h-7 w-7 text-muted-foreground"
							onclick={toggleAll}
						>
							<ListChevronsUpDown class="h-3.5 w-3.5" />
						</Button>
					</Tooltip.Trigger>

					<Tooltip.Content>
						Toggle folders
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</div>

		<!-- Open Folder -->
		<div class="mt-2">
			<Button
				variant="secondary"
				class="h-8 w-full text-sm"
				onclick={openFolder}
			>
				Open Folder
			</Button>
		</div>

		<!-- Sort Controls -->
		<div class="mt-2 flex items-center gap-1">
			<span class="mr-1 text-[11px] text-muted-foreground">
				Sort
			</span>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant={sortMode === 'name-asc'
							? 'secondary'
							: 'ghost'}
						size="icon"
						class="h-7 w-7"
						onclick={() => {
							sortMode = 'name-asc'
							sync()
						}}
					>
						<ArrowDownAZ class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>

				<Tooltip.Content>
					Name A–Z
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant={sortMode === 'name-desc'
							? 'secondary'
							: 'ghost'}
						size="icon"
						class="h-7 w-7"
						onclick={() => {
							sortMode = 'name-desc'
							sync()
						}}
					>
						<ArrowUpZA class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>

				<Tooltip.Content>
					Name Z–A
				</Tooltip.Content>
			</Tooltip.Root>

			<div class="mx-1 h-4 w-px bg-border" />

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant={sortMode === 'modified-desc'
							? 'secondary'
							: 'ghost'}
						size="icon"
						class="h-7 w-7"
						onclick={() => {
							sortMode = 'modified-desc'
							sync()
						}}
					>
						<CalendarArrowDown class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>

				<Tooltip.Content>
					Newest first
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant={sortMode === 'modified-asc'
							? 'secondary'
							: 'ghost'}
						size="icon"
						class="h-7 w-7"
						onclick={() => {
							sortMode = 'modified-asc'
							sync()
						}}
					>
						<CalendarArrowUp class="h-3.5 w-3.5" />
					</Button>
				</Tooltip.Trigger>

				<Tooltip.Content>
					Oldest first
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<VirtualFileTree
			rows={flatRows}
			{loadFile}
			{toggleFolder}
		/>
	</Sidebar.Content>

	<Sidebar.Footer />
</Sidebar.Root>