<script lang="ts">
	import { Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Subreddit } from '$lib/server/db/schema';

	/* TODO
	- Add drag and drop functionality to reorder subreddits
	- Or add the posibility to pin certain subreddits to the top
	- Scroll to selected subreddit when it is not visible
	*/

	type UrlListProps = {
		subreddits: Subreddit[];
		selectedSubredditId: Subreddit['id'] | null;
		onRemoveSubreddit: (id: Subreddit) => void;
		onMoveSubreddit: (dragIndex: number, hoverIndex: number) => void;
	};

	let {
		subreddits,
		selectedSubredditId = $bindable(),
		onRemoveSubreddit,
		onMoveSubreddit
	}: UrlListProps = $props();
</script>

{#if subreddits.length === 0}
	<div class="py-8 text-center">
		<p class="text-muted-foreground">No URLs found</p>
	</div>
{:else}
	<ul class="space-y-1">
		{#each subreddits as subreddit}
			<li
				class={`mb-2 cursor-pointer rounded-md p-3 ${
					selectedSubredditId === subreddit.id
						? 'bg-muted'
						: 'hover:bg-muted/50'
				} 
             `}
			>
				<a
					class="flex items-center justify-center"
					href="/app/r/{subreddit.id}"
				>
					<div class="min-w-0 flex-1">
						<h3 class="truncate font-medium">{subreddit.id}</h3>
						<p class="truncate text-sm text-muted-foreground">
							{subreddit.url}
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onRemoveSubreddit(subreddit);
						}}
						aria-label={`Remove ${subreddit.id}`}
					>
						<Trash2 class="h-4 w-4" />
					</Button>
				</a>
			</li>
		{/each}
	</ul>
{/if}
