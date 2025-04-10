<script lang="ts">
	import { api } from '$lib/api';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Search, SettingsIcon } from '@lucide/svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import SubredditList from '$lib/features/subreddits/subreddit-list.svelte';
	import AddSubredditDialog from '$lib/features/subreddits/add-subreddit-dialog.svelte';
	import SubredditData from '$lib/features/subreddits/subreddit-data.svelte';

	let id = $derived(page.params.id);
	let subredditId = $derived(parseInt(page.params.subreddit));

	let subreddits = api.subreddit.list.query({ workspaceId: id });

	$inspect('subredditId', subredditId, id, page.params);
	// const subredditId = page.params.subreddit;

	let filteredSubreddits = $derived.by(() => {
		if ($subreddits.isSuccess) {
			return $subreddits.data.filter((subreddit) =>
				subreddit.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		return [];
	});

	let selectedSubredditId = $derived(
		filteredSubreddits.find((r) => r.id === subredditId)?.id || null
	);
	let searchQuery = $state<string>('');

	// const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);
	// const [searchQuery, setSearchQuery] = useState('');
	// const [showSettings, setShowSettings] = useState(false);

	// Load saved URLs from localStorage on initial render
	// useEffect(() => {
	// 	const savedUrls = localStorage.getItem('dashboard-urls');
	// 	if (savedUrls) {
	// 		const parsedUrls = JSON.parse(savedUrls);
	// 		setUrls(parsedUrls);
	// 		if (parsedUrls.length > 0) {
	// 			setSelectedUrl(parsedUrls[0]);
	// 		}
	// 	} else {
	// 		// Add some example URLs if none exist
	// 		const exampleUrls = [
	// 			{ id: '1', url: 'https://example.com', title: 'Example Website' },
	// 			{ id: '2', url: 'https://demo.org', title: 'Demo Site' },
	// 			{ id: '3', url: 'https://test.com', title: 'Test Portal' }
	// 		];
	// 		setUrls(exampleUrls);
	// 		setSelectedUrl(exampleUrls[0]);
	// 		localStorage.setItem('dashboard-urls', JSON.stringify(exampleUrls));
	// 	}
	// }, []);

	// // Save URLs to localStorage whenever they change
	// useEffect(() => {
	// 	if (urls.length > 0) {
	// 		localStorage.setItem('dashboard-urls', JSON.stringify(urls));
	// 	}
	// }, [urls]);

	// const filteredUrls = urls.filter(
	// 	(url) =>
	// 		url.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
	// 		url.url.toLowerCase().includes(searchQuery.toLowerCase())
	// );

	// const handleAddUrl = (newUrl: Url) => {
	// 	const updatedUrls = [...urls, newUrl];
	// 	setUrls(updatedUrls);
	// 	setSelectedUrl(newUrl);
	// };

	// const handleRemoveUrl = (id: string) => {
	// 	const updatedUrls = urls.filter((url) => url.id !== id);
	// 	setUrls(updatedUrls);

	// 	if (selectedUrl && selectedUrl.id === id) {
	// 		setSelectedUrl(updatedUrls.length > 0 ? updatedUrls[0] : null);
	// 	}
	// };

	// const handleMoveUrl = (dragIndex: number, hoverIndex: number) => {
	// 	const draggedUrl = filteredUrls[dragIndex];
	// 	const updatedUrls = [...urls];

	// 	// Find the actual indices in the full list
	// 	const draggedUrlIndex = urls.findIndex((url) => url.id === draggedUrl.id);
	// 	const hoverUrlIndex = urls.findIndex(
	// 		(url) => url.id === filteredUrls[hoverIndex].id
	// 	);

	// 	// Remove the dragged item
	// 	updatedUrls.splice(draggedUrlIndex, 1);
	// 	// Insert it at the new position
	// 	updatedUrls.splice(hoverUrlIndex, 0, draggedUrl);

	// 	setUrls(updatedUrls);
	// };
</script>

<div class="flex h-screen flex-col">
	<header class="flex items-center justify-between border-b bg-background p-4">
		<h1 class="text-xl font-bold">URL Dashboard</h1>
		<Button variant="ghost" size="icon" aria-label="Settings" href="/settings">
			<SettingsIcon class="h-5 w-5" />
		</Button>
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
					value={''}
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
					onSelectSubreddit={(r) => goto(`/app/${id}/r/${r}`)}
					onRemoveSubreddit={() => {}}
					onMoveSubreddit={() => {}}
				/>
			</div>
		</aside>
		<main class="flex-1 overflow-auto p-4">
			{#if subredditId}
				{@const subredditData = $subreddits?.data?.find(
					(r) => r.id === subredditId
				)}
				{#key subredditId}
					<SubredditData
						{subredditId}
						title={subredditData?.name}
						url={subredditData?.url}
					/>
				{/key}
			{:else}
				<div class="flex h-full items-center justify-center">
					<p class="text-muted-foreground">Select a URL to view its data</p>
				</div>
			{/if}
		</main>
	</div>
</div>
