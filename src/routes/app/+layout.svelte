<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { api } from '$lib/api';
	import Store from '$lib/features/store.svelte';
	let { children } = $props();
</script>

<QueryClientProvider client={api.queryClient}>
	<Store />
	<Toaster />

	<main class="">
		{@render children()}
	</main>
</QueryClientProvider>
