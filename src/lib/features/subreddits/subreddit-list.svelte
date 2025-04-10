<script lang="ts">
	import { Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Subreddit } from '$lib/server/db/schema';

	type UrlListProps = {
		subreddits: Subreddit[];
		selectedSubredditId: Subreddit['id'] | null;
		onSelectSubreddit: (id: Subreddit['id']) => void;
		onRemoveSubreddit: (id: Subreddit['id']) => void;
		onMoveSubreddit: (dragIndex: number, hoverIndex: number) => void;
	};

	let {
		subreddits,
		selectedSubredditId = $bindable(),
		onSelectSubreddit,
		onRemoveSubreddit,
		onMoveSubreddit
	}: UrlListProps = $props();

	let isDragging = $state(false);
</script>

{#if subreddits.length === 0}
	<div class="py-8 text-center">
		<p class="text-muted-foreground">No URLs found</p>
	</div>
{:else}
	<ul class="space-y-1">
		{#each subreddits as subreddit, index}
			<li
				class={`mb-2 flex cursor-pointer items-center justify-between rounded-md p-3 ${
					selectedSubredditId === subreddit.id
						? 'bg-muted'
						: 'hover:bg-muted/50'
				} 
             ${!!isDragging ? 'opacity-50' : 'opacity-100'}`}
				onclick={() => onSelectSubreddit(subreddit.id)}
			>
				<div class="min-w-0 flex-1">
					<h3 class="truncate font-medium">{subreddit.name}</h3>
					<p class="truncate text-sm text-muted-foreground">{subreddit.url}</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onclick={(e) => {
						e.stopPropagation();
						onRemoveSubreddit(subreddit.id);
					}}
					aria-label={`Remove ${subreddit.name}`}
				>
					<Trash2 class="h-4 w-4" />
				</Button>
			</li>
		{/each}
	</ul>
{/if}
