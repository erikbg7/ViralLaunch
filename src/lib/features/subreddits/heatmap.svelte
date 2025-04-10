<script module>
</script>

<script lang="ts">
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import { aggregateRecordsToHourlyData } from '$lib/graph/aggregators';
	import type { SubredditRecord } from '$lib/server/db/schema';

	let hours = Array.from({ length: 24 }, (_, i) => i);
	let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	let { records: r = [] }: { records: SubredditRecord[][] } = $props();

	let records = aggregateRecordsToHourlyData(r);
	let maxValue = records.maxUsers;

	console.log({ rrrrr: records });

	const formatHour = (hour: number) => {
		return `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'am' : 'pm'}`;
	};

	const getCellColor = (users: number | undefined, hour: number) => {
		if (!users) {
			return 'transparent';
		}

		const intensity = users / maxValue;
		return `hsla(24, 95%, 53%, ${intensity * 0.9})`;
	};
</script>

<div
	class="flex h-full w-full flex-col items-center justify-center overflow-x-auto"
>
	<div class="overflow-x-auto pb-4">
		<div class="min-w-[720px]">
			<div class="flex gap-[2px]">
				<!-- Empty corner cell -->
				<div class="w-12"></div>

				<!-- Hour labels  -->
				{#each hours as hour}
					<div class="w-10 text-center text-xs text-muted-foreground">
						{formatHour(hour)}
					</div>
				{/each}
			</div>

			<TooltipProvider>
				{#each days as day, dayIndex}
					<div class="flex h-10 items-center">
						<!-- Day label -->
						<div class="w-12 pr-2 text-right text-sm font-medium">{day}</div>

						<!-- Hour cells -->
						{#each hours as hour}
							{@const users =
								records.dailyRecordsByHour
									.find((d) => d.day === dayIndex)
									?.records?.at?.(hour)?.users || 0}

							<Tooltip delayDuration={100}>
								<TooltipTrigger>
									<div
										class="m-px h-8 w-10 rounded transition-colors duration-200 hover:border-2 hover:border-[#f97015]"
										style={`background-color: ${getCellColor(users, hour)}`}
									></div>
								</TooltipTrigger>
								<TooltipContent>
									<div class="text-center">
										<div class="font-medium">
											{days[dayIndex]} at {formatHour(hour)}
										</div>
										<div>{users} users</div>
									</div>
								</TooltipContent>
							</Tooltip>
						{/each}
					</div>
				{/each}
			</TooltipProvider>
		</div>
	</div>

	<!-- Legend -->
	<div class="mt-2 flex items-center justify-center">
		<div class="mr-2 text-xs text-muted-foreground">Low</div>
		<div class="flex h-4">
			{#each [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9] as intensity}
				<div
					class="h-4 w-6"
					style={`background-color: hsla(24, 95%, 53%, ${intensity})`}
				></div>
			{/each}
		</div>
		<div class="ml-2 text-xs text-muted-foreground">High</div>
	</div>
</div>
