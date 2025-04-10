<script lang="ts">
	import { api } from '$lib/api';
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
	import { subredditStore } from '$lib/stores/subreddits.svelte';

	type Props = {
		title?: string;
		url?: string;
		subredditId: number;
	};

	let { subredditId = $bindable(), title, url }: Props = $props();

	let subreddit = api.subreddit.get.query({ subredditId });
	let records = api.records.get.query({ workspaceId: '2', subredditId });

	let heatMapRecords = $derived.by(() => {
		if (!$records.data) {
			return [];
		}
	});

	$inspect({ $records });
</script>

<div class="space-y-6">
	<Card>
		<CardHeader>
			<CardTitle>r/{title}</CardTitle>
			<CardDescription>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-500 hover:underline"
				>
					{url}
				</a>
			</CardDescription>
		</CardHeader>
		<CardContent>
			<Tabs bind:value={subredditStore.selectedChart}>
				<TabsList class="mb-4">
					<TabsTrigger value={ChartTypes.WEEKLY}>Weekly Chart</TabsTrigger>
					<TabsTrigger value={ChartTypes.DAILY}>Daily Chart</TabsTrigger>
				</TabsList>
				<TabsContent value={ChartTypes.WEEKLY} class="h-[400px]">
					<!-- responsive container -->
					<div class="h-full w-full">
						<!-- <WeeklyChart chartData={$subreddit?.data?.results || []} /> -->
						<Heatmap records={$records.data} />
					</div>
				</TabsContent>
				<TabsContent value={ChartTypes.DAILY} class="h-[400px]">
					<!-- responsive container -->
					<div class="h-full w-full">
						<!-- <DailyChart chartData={$subreddit?.data?.results || []} /> -->
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
