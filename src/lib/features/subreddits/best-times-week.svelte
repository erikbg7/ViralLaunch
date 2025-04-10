<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';

	let topDays = [0, 1, 2];
	let maxUsers = 700;
	let weekData = [
		{ day: 'Monday', peakUsers: 100, peakHour: '12 PM' },
		{ day: 'Tuesday', peakUsers: 200, peakHour: '1 PM' },
		{ day: 'Wednesday', peakUsers: 300, peakHour: '2 PM' },
		{ day: 'Thursday', peakUsers: 400, peakHour: '3 PM' },
		{ day: 'Friday', peakUsers: 500, peakHour: '4 PM' },
		{ day: 'Saturday', peakUsers: 600, peakHour: '5 PM' },
		{ day: 'Sunday', peakUsers: 700, peakHour: '6 PM' }
	];
</script>

<Card>
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			User Peaks This Week
			<CalendarDays class="h-4 w-4 text-muted-foreground" />
		</CardTitle>
		<CardDescription>Daily peak users (top 3 days highlighted)</CardDescription>
	</CardHeader>
	<CardContent>
		{#if weekData.length === 0}
			<div class="flex h-32 items-center justify-center">
				<p class="text-muted-foreground">Loading data...</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each weekData as day, index}
					{@const isTopDay = topDays.includes(index)}
					{@const rank = topDays.indexOf(index) + 1}

					<div class="flex items-center gap-3">
						<div class="w-24 text-sm font-medium">{day.day}</div>
						<div class="h-8 flex-1 overflow-hidden rounded-md bg-muted">
							<div
								class="flex h-full items-center rounded-md px-3 font-medium text-white"
								style={`
                                width: ${(day.peakUsers / maxUsers) * 100}%;
                                background-color: ${
																	isTopDay
																		? rank === 1
																			? 'hsl(24, 95%, 53%)'
																			: rank === 2
																				? 'hsl(28, 90%, 55%)'
																				: 'hsl(32, 85%, 57%)'
																		: 'hsl(30, 30%, 70%)'
																};
                                `}
							>
								{day.peakUsers} at {day.peakHour}
							</div>
						</div>
						{#if isTopDay}
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
