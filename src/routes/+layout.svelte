<script lang="ts">
	import '../app.css';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Explorer from '$lib/features/explorer/components/Explorer.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<Tooltip.Provider>
		<Explorer />
		{@render children()}
	</Tooltip.Provider>
</Sidebar.Provider>
