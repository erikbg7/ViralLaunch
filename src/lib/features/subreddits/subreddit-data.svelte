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
	import { serverConfig } from '$lib/stores/settings.svelte';
	import {
		mapRecords,
		type ParsedRecords
	} from '$lib/stores/subreddit-data.svelte';
	import { subredditStore } from '$lib/stores/subreddits.svelte';

	type Props = {
		subredditId: number;
	};

	let { subredditId = $bindable() }: Props = $props();

	let weeklyData =
		$state<{ interval: number; date: Date; users: number }[][]>();

	let parsedRecords = $state<ParsedRecords>();

	// let subreddit = api.subreddit.get.query({ subredditId });
	let records = api.records.get.query({ workspaceId: '2', subredditId });
	let records2 = api.records.get2.query({ workspaceId: '2', subredditId });

	$effect(() => {
		let weeklyUsersPeak = 0;

		if ($records2.data) {
			parsedRecords = mapRecords($records2.data);
			const r = $records2.data;
			let r2 = [];
			const groupedByUtcDay: typeof weeklyData = Array.from(
				{ length: 7 },
				() => []
			);

			for (const record of r) {
				weeklyUsersPeak = Math.max(weeklyUsersPeak, record.users);
				const localDate = new Date(
					serverConfig.dateFormatter.format(Date.parse(record.timestamp))
				);

				const day = localDate.getDay(); // 0 = Sunday

				r2.push({
					date: localDate,
					interval: record.interval,
					users: record.users
				});

				groupedByUtcDay[day].push({
					date: localDate,
					interval: record.interval,
					users: record.users
				});
			}

			groupedByUtcDay.forEach((dayRecords) => {
				dayRecords.sort((a, b) => {
					const hourA = a.date.getHours();
					const hourB = b.date.getHours();
					return hourA - hourB;
				});
			});

			// TODO: once the records are grouped by day, we need to sort them by hour
			weeklyData = groupedByUtcDay;
			$inspect({ $records2: $records2.data, r2, weeklyData });
		}
	});

	$inspect({ API_RECORDS: $records });
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
							{#if weeklyData?.length}
								<Heatmap
									maxUsers={parsedRecords?.peakWeeklyUsers}
									hourlyRecords={parsedRecords?.hourlyRecords}
								/>
							{/if}
						</div>
					</TabsContent>
					<TabsContent value={ChartType.LINEAR} class="h-[400px]">
						<!-- responsive container -->
						<div class="h-full w-full">
							<!-- <HourlyChart chartData={$records?.data?.[0] || []} /> -->
							<WeeklyChart chartData={$records?.data || []} />
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<BestTimesToday bestTimes={parsedRecords?.bestTodayTimes || []} />
			<BestTimesWeek records={$records.data || []} />
		</div>
	</div>
{/if}
