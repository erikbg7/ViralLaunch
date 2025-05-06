<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { weekDays } from '$lib/constants';
	import type { ParsedRecords } from '$lib/records/records.map';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';

	let {
		maxUsers,
		bestTimes,
		bestWeeklyTimes
	}: {
		maxUsers: number;
		bestTimes: ParsedRecords['avgUsersByDay'];
		bestWeeklyTimes: ParsedRecords['bestWeeklyTimes'];
	} = $props();

	let topDays = Object.entries(bestTimes)
		.sort(([, a], [, b]) => b - a)
		.map(([day]) => day)
		.slice(0, 3);
</script>

<Card>
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			Average Users This Week
			<CalendarDays class="h-4 w-4 text-muted-foreground" />
		</CardTitle>
		<CardDescription>Top 3 days with highest averge users</CardDescription>
	</CardHeader>
	<CardContent>
		{#if !bestTimes}
			<div class="flex h-32 items-center justify-center">
				<p class="text-muted-foreground">Loading data...</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each weekDays as day}
					{@const avgUsers = bestTimes[day]}
					{@const record = bestWeeklyTimes[day]}
					{@const rank = topDays.indexOf(day) + 1}

					<div class="flex items-center gap-3">
						<div class="w-24 text-sm font-medium">{day || ''}</div>
						<div class="h-8 flex-1 overflow-hidden rounded-md bg-muted">
							<div
								class="flex h-full items-center rounded-md px-3 font-medium text-white"
								style={`
                                width: ${(avgUsers / maxUsers) * 100}%;
                                background-color: ${
																	!!rank
																		? rank === 1
																			? 'hsl(24, 95%, 53%)'
																			: rank === 2
																				? 'hsl(28, 90%, 55%)'
																				: 'hsl(32, 85%, 57%)'
																		: 'hsl(30, 30%, 70%)'
																};
                                `}
							>
								{avgUsers} ({record.users} at {record.hhmm})
							</div>
						</div>
						{#if rank}
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600"
							>
								#{rank}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
