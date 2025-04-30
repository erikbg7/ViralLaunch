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
	import { ChartType } from '$lib/constants';
	import BestTimesToday from '$lib/features/subreddits/best-times-today.svelte';
	import BestTimesWeek from '$lib/features/subreddits/best-times-week.svelte';
	import Heatmap from '$lib/features/subreddits/heatmap.svelte';
	import {
		deleteAllRecords,
		generateFakeRecords
	} from '$lib/features/subreddits/utils';
	import WeeklyChart from '$lib/features/subreddits/weekly-chart.svelte';
	import {
		mapRecords,
		type ParsedRecords
	} from '$lib/stores/subreddit-data.svelte';
	import { subredditStore } from '$lib/stores/subreddits.svelte';

	type Props = {
		subredditId: string;
	};

	let { subredditId = $bindable() }: Props = $props();

	let records = api.records.get.query({ subredditId });
	let parsedRecords = $derived<ParsedRecords | undefined>(
		$records.data && mapRecords($records.data)
	);
</script>

{#if !$records.data}
	Loading...
{:else}
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
						<TabsTrigger value={ChartType.HEATMAP}>Heatmap</TabsTrigger>
						<TabsTrigger value={ChartType.LINEAR}>Linear Chart</TabsTrigger>
					</TabsList>

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

					<TabsContent value={ChartType.HEATMAP} class="h-[400px]">
						<!-- responsive container -->
						<div class="h-full w-full">
							{#if parsedRecords}
								<Heatmap
									maxUsers={parsedRecords?.maxHourlyUsers}
									hourlyRecords={parsedRecords?.hourlyRecords}
								/>
							{/if}
						</div>
					</TabsContent>
					<TabsContent value={ChartType.LINEAR} class="h-[400px]">
						<!-- responsive container -->
						<div class="h-full w-full">
							<!-- <HourlyChart chartData={$records?.data?.[0] || []} /> -->
							<WeeklyChart chartData={parsedRecords?.records} />
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#if parsedRecords}
				<BestTimesToday bestTimes={parsedRecords.bestTodayTimes} />
				<BestTimesWeek
					maxUsers={parsedRecords.peakWeeklyUsers}
					bestTimes={parsedRecords.bestWeeklyTimes}
				/>
			{/if}
		</div>
	</div>
{/if}
