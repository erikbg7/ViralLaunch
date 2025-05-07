<script lang="ts">
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import { TimeFormat, type WeekDay } from '$lib/constants';
	import { type ParsedRecords } from '$lib/records/records.map';

	let hours = Array.from({ length: 24 }, (_, i) => i);

	let {
		weekdays,
		timeformat,
		hourlyRecords,
		avgUsers
	}: {
		maxUsers: number;
		weekdays: WeekDay[];
		timeformat: TimeFormat;
		hourlyRecords: ParsedRecords['hourlyRecords'];
		avgUsers: number;
	} = $props();

	const getCellColor = (users: number) => {
		const intensity = users / avgUsers;
		return `hsla(24, 95%, 53%, ${Math.min(intensity * 0.5, 1)})`;
	};

	const getRecordUsers = (day: WeekDay, hour: number) => {
		const dayRecords = hourlyRecords[day];
		const records = dayRecords.filter((r) => r.date.getHours() === hour);
		const record = records[records.length - 1];

		return record ? record.users : 0;
	};

	const getHourLabel = (hour: number): string => {
		if (timeformat === TimeFormat.H24) {
			return `${hour.toString().padStart(2, '0')}h`;
		} else {
			const period = hour < 12 ? 'AM' : 'PM';
			const displayHour = hour % 12 === 0 ? 12 : hour % 12;
			return `${displayHour}${period}`;
		}
	};
</script>

<div
	class="flex h-full w-full flex-col items-center justify-center overflow-x-auto"
>
	<div class="w-full overflow-x-auto pb-4">
		<div class="flex gap-[2px]">
			<!-- Empty corner cell -->
			<div class="w-12"></div>

			<!-- Hour labels  -->
			{#each hours as hour}
				<div class="w-[4%] text-center text-xs text-muted-foreground">
					{getHourLabel(hour)}
				</div>
			{/each}
		</div>

		<TooltipProvider>
			{#each weekdays as day}
				<div class="flex h-10 w-full items-center">
					<!-- Day label -->
					<div class="w-12 pr-2 text-right text-sm font-medium">
						{day.slice(0, 3)}
					</div>

					<!-- Hour cells -->
					{#each hours as hour}
						{@const users = getRecordUsers(day, hour)}
						<Tooltip delayDuration={100}>
							<TooltipTrigger class="m-px w-[4%]">
								<div
									class="h-8 w-full rounded transition-colors duration-200 hover:border-2 hover:border-[#f97015]"
									style={`background-color: ${getCellColor(users)}`}
								></div>
							</TooltipTrigger>
							<TooltipContent>
								<div class="text-center">
									<div class="font-medium">
										{day.slice(0, 3)} at {getHourLabel(hour)}
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
