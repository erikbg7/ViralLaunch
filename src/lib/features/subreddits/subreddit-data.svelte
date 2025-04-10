<script lang="ts">
	import { api } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger
	} from '$lib/components/ui/tabs';
	import { ChartTypes } from '$lib/constants';
	import BestTimesToday from '$lib/features/subreddits/best-times-today.svelte';
	import BestTimesWeek from '$lib/features/subreddits/best-times-week.svelte';
	import Heatmap from '$lib/features/subreddits/heatmap.svelte';
	import HourlyChart from '$lib/features/subreddits/hourly-chart.svelte';
	import { generateFakeRecords } from '$lib/features/subreddits/utils';
	import { subredditStore } from '$lib/stores/subreddits.svelte';

	type Props = {
		subredditId: number;
	};

	let { subredditId = $bindable() }: Props = $props();

	let subreddit = api.subreddit.get.query({ subredditId });
	let records = api.records.get.query({ workspaceId: '2', subredditId });

	// let heatMapRecords = $derived.by(() => {
	// 	if (!$records.data) {
	// 		return [];
	// 	}
	// });

	$inspect({ $records });
</script>

<div class="space-y-6">
	<Card>
		<CardHeader>
			<CardTitle>Weekly Activity</CardTitle>
			<CardDescription>
				User activity patterns throughout the week
			</CardDescription>
		</CardHeader>
		<CardContent>
			<Tabs bind:value={subredditStore.selectedChart}>
				<TabsList class="mb-4">
					<TabsTrigger value={ChartTypes.HEATMAP}>Heatmap</TabsTrigger>
					<TabsTrigger value={ChartTypes.LINEAR}>Linear Chart</TabsTrigger>
				</TabsList>

				<Button
					variant="default"
					aria-label="Fake data"
					onclick={() => generateFakeRecords(subredditId)}
				>
					Generate Fake Records
				</Button>

				<TabsContent value={ChartTypes.HEATMAP} class="h-[400px]">
					<!-- responsive container -->
					<div class="h-full w-full">
						<Heatmap records={$records.data} />
					</div>
				</TabsContent>
				<TabsContent value={ChartTypes.LINEAR} class="h-[400px]">
					<!-- responsive container -->
					<div class="h-full w-full">
						<HourlyChart chartData={$records?.data?.[0] || []} />
					</div>
				</TabsContent>
			</Tabs>
		</CardContent>
	</Card>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<BestTimesToday />
		<BestTimesWeek />
	</div>

	<!-- {/* Add the UserActivity component */} -->
	<!-- <UserActivity url={url} /> -->
</div>
