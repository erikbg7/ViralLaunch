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

	import { ChartType } from '$lib/constants';
	import BestTimesToday from '$lib/features/subreddits/best-times-today.svelte';
	import BestTimesWeek from '$lib/features/subreddits/best-times-week.svelte';
	import WeeklyChart from '$lib/features/subreddits/weekly-chart.svelte';
	import DailyChart from '$lib/features/subreddits/daily-chart.svelte';
	import Heatmap from '$lib/features/subreddits/heatmap.svelte';
	import { serverConfig } from '$lib/stores/settings.svelte';
	import { mapRecords, type ParsedRecords } from '$lib/records/records.map';
	import { subredditStore } from '$lib/stores/subreddits.svelte';

	type Props = {
		subredditId: string;
	};

	let { subredditId = $bindable() }: Props = $props();

	let records = api.records.get.query({ subredditId });
	let parsedRecords = $derived<ParsedRecords | undefined>(
		$records.data &&
			mapRecords($records.data, serverConfig.timezone, serverConfig.timeformat)
	);
</script>

{#if !$records.data}
	Loading...
{:else}
	<div class="space-y-6">
		<Card>
			<CardHeader>
				<CardTitle>Activity Heatmap</CardTitle>
				<CardDescription>
					Average hourly users online by day of the week
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="h-full w-full">
					{#if parsedRecords}
						<Heatmap
							avgUsers={parsedRecords.avgWeeklyUsers}
							timeformat={serverConfig.timeformat}
							weekdays={serverConfig.weekdays}
							maxUsers={parsedRecords.maxHourlyUsers}
							hourlyRecords={parsedRecords.hourlyRecords}
						/>
					{/if}
				</div>
			</CardContent>
		</Card>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#if parsedRecords}
				<BestTimesToday bestTimes={parsedRecords.bestTodayTimes} />
				<BestTimesWeek
					weekdays={serverConfig.weekdays}
					maxUsers={parsedRecords.maxAvgUsers}
					bestTimes={parsedRecords.avgUsersByDay}
					bestWeeklyTimes={parsedRecords.bestWeeklyTimes}
				/>
			{/if}
		</div>

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
						<TabsTrigger value={ChartType.DAILY}>Daily Chart</TabsTrigger>
						<TabsTrigger value={ChartType.WEEKLY}>Weekly Chart</TabsTrigger>
					</TabsList>

					<TabsContent value={ChartType.DAILY} class="h-[400px]">
						<!-- responsive container -->
						<div class="h-full w-full">
							{#if parsedRecords}
								<DailyChart
									timezone={serverConfig.timezone}
									timeformat={serverConfig.timeformat}
									chartData={parsedRecords.records}
								/>
							{/if}
						</div>
					</TabsContent>

					<TabsContent value={ChartType.WEEKLY} class="h-[400px]">
						<!-- responsive container -->
						<div class="h-full w-full">
							{#if parsedRecords}
								<WeeklyChart
									weekdays={serverConfig.weekdays}
									timezone={serverConfig.timezone}
									timeformat={serverConfig.timeformat}
									chartData={parsedRecords.records}
								/>
							{/if}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	</div>
{/if}
