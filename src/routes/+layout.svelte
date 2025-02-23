<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	let { children } = $props();
</script>

<Toaster />

<main class="mx-auto max-w-7xl">
	{@render children()}
</main>
