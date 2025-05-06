<script lang="ts">
	import { api } from '$lib/api';
	import { page } from '$app/state';
	import { Clock, ExternalLink, Search, SettingsIcon } from '@lucide/svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import { debounced } from '$lib/stores/debounce.svelte';
	import { subredditStore } from '$lib/stores/subreddits.svelte';
	import SubredditList from '$lib/features/subreddits/subreddit-list.svelte';
	import AddSubredditDialog from '$lib/features/subreddits/add-subreddit-dialog.svelte';
	import SubredditData from '$lib/features/subreddits/subreddit-data.svelte';
	import type { Subreddit } from '$lib/server/db/schema';
	import { serverConfig } from '$lib/stores/settings.svelte';

	import {
		deleteAllRecords,
		generateFakeRecords
	} from '$lib/features/subreddits/utils';

	let subredditId = $derived(page.params.subreddit);

	let subreddits = api.subreddit.following.query();

	let searchQuery = $state<string | null | undefined>();

	let filteredSubreddits = $derived.by(
		debounced(() => {
			if ($subreddits.isSuccess) {
				const q = searchQuery?.toLowerCase() || '';
				return $subreddits.data.filter((subreddit) =>
					subreddit.id.toLowerCase().includes(q)
				);
			}
			return [];
		}, 200)
	);

	let selectedSubredditId = $derived(
		filteredSubreddits.find((r) => r.id === subredditId)?.id || null
	);

	$effect(() => {
		if ($subreddits.data && subredditId) {
			const selectedSubreddit = $subreddits.data.find(
				(r) => r.id === subredditId
			);
			if (selectedSubreddit) {
				subredditStore.selectedSubreddit = selectedSubreddit;
				subredditStore.selectedSubredditName = selectedSubreddit.id;
			}
		}
	});

	const handleRemoveSubreddit = (subreddit: Subreddit) => {
		console.log('trying to remove the subreddit');
	};
</script>

<div class="flex h-screen flex-col">
	<header
		class="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4"
	>
		<h1 class="text-xl font-bold">Dashboard</h1>
		<div class="flex items-center gap-4">
			<!-- REMOVABLE -->
			<Button
				variant="default"
				aria-label="Fake data"
				onclick={() => generateFakeRecords(subredditId)}
			>
				Generate Fake Records
			</Button>

			<Button
				variant="default"
				aria-label="Fake data"
				onclick={() => deleteAllRecords(subredditId)}
			>
				Delete All Records
			</Button>
			<!-- REMOVABLE -->
			{#if subredditStore.selectedSubreddit}
				<div class="hidden items-center md:flex">
					<a
						href={subredditStore.selectedSubreddit.url}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-1 text-sm text-blue-500 hover:underline"
					>
						r/{subredditStore.selectedSubredditName}
						<ExternalLink class="h-3.5 w-3.5" />
					</a>
				</div>
			{/if}
			<Separator orientation="vertical" class="hidden h-6 md:block" />
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<div
							class="flex cursor-help items-center gap-1 text-sm text-muted-foreground"
						>
							<Clock class="h-4 w-4" />
							<span>{serverConfig.timezone}</span>
							<!-- <span>{getTimezoneLabel(settings.timezone)}</span> -->
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Timezone used for data display. Change in settings.</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Button
				variant="ghost"
				size="icon"
				aria-label="Settings"
				href="/app/settings"
			>
				<SettingsIcon class="h-5 w-5" />
			</Button>
		</div>
	</header>
	<div class="flex h-[calc(100vh-4rem)] flex-row">
		<aside class="flex w-full flex-col border-r p-4 md:w-80">
			<div class="relative mb-4">
				<Search
					class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
				/>
				<Input
					type="search"
					placeholder="Search URLs..."
					class="pl-8"
					bind:value={searchQuery}
				/>
			</div>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Subreddits List</h2>
				<AddSubredditDialog onAddSubreddit={() => {}} />
			</div>
			<div class="flex-1 overflow-auto">
				<SubredditList
					subreddits={filteredSubreddits}
					{selectedSubredditId}
					onRemoveSubreddit={handleRemoveSubreddit}
				/>
			</div>
		</aside>
		<main class="flex-1 overflow-auto p-4">
			{#if subredditId}
				{#key subredditId}
					<SubredditData {subredditId} />
				{/key}
			{:else}
				<div class="flex h-full items-center justify-center">
					<p class="text-muted-foreground">
						Select a subreddit to view its data
					</p>
				</div>
			{/if}
		</main>
	</div>
</div>
