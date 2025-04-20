<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import type { EventHandler } from 'svelte/elements';
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogFooter,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	type Subreddit = {
		url: string; // https://reddit.com/r/subreddit
		title: string; // r/subreddit (extracted via API)
	};

	// 1. copy subreddit url
	// 2. send to api
	// 3. Make request to url to see if valid (200 back)
	// 4. If valid, extract title, then add to db

	type Props = {
		onAddSubreddit: (subredditUrl: Subreddit['url']) => void;
	};

	let { onAddSubreddit }: Props = $props();

	// const [open, setOpen] = useState(false);
	let url = $state<string>('');
	let open = $state<boolean>(false);
	let error = $state<string | null>(null);
	// const [error, setError] = useState<string | null>(null);

	const handleSubmit: EventHandler = (e) => {
		e.preventDefault();

		// Basic validation

		if (!url.trim()) {
			error = 'URL is required';
			return;
		}

		try {
			// Check if URL is valid
			new URL(url);

			// Add the new URL
			onAddSubreddit(url.trim());

			// Reset form and close dialog
			url = '';
			error = null;
			open = false;
		} catch (err) {
			error = 'Please enter a valid URL (including http:// or https://)';
		}
	};
</script>

<Dialog {open} onOpenChange={(o) => (open = o)}>
	<DialogTrigger>
		<Button size="sm" class="gap-1">
			<Plus class="h-4 w-4" />
			Track /r
		</Button>
	</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<form onsubmit={handleSubmit}>
			<DialogHeader>
				<DialogTitle>Track New Subreddit</DialogTitle>
				<DialogDescription>
					Copy/paste a new subreddit url to monitor it.
				</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">URL</Label>
					<Input
						id="url"
						bind:value={url}
						class="col-span-3"
						placeholder="https://example.com"
					/>
				</div>
				{#if error}
					<div class="col-span-4 mt-2 text-center text-sm text-red-500">
						{error}
					</div>
				{/if}
			</div>
			<DialogFooter>
				<Button type="submit">Track</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
