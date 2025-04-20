<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { api } from '$lib/api';
	let { children } = $props();
</script>

<QueryClientProvider client={api.queryClient}>
	<Toaster />

	<main class="">
		{@render children()}
	</main>
</QueryClientProvider>
