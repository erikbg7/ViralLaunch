<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { Rocket } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { enhance } from '$app/forms';
	let { children } = $props();
</script>

<Toaster />

<navbar class="flex items-center justify-between p-4">
	<a href="/app" class="flex items-center space-x-4">
		<Rocket />
		<span class="text-lg font-semibold">ViralLaunch</span>
	</a>

	<div>
		<span> erikbg7 </span>

		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>

		<form method="POST" action="/login?/logout" use:enhance>
			<button>Sign out</button>
		</form>
	</div>
</navbar>
<main class="mx-auto max-w-7xl">
	{@render children()}
</main>
