<script lang="ts">
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import { weekDays, type WeekDay } from '$lib/constants';
	import { type ParsedRecords } from '$lib/stores/subreddit-data.svelte';
	import { formatHourByLocale } from '$lib/timezone';

	let hours = Array.from({ length: 24 }, (_, i) => i);

	let {
		maxUsers = 0,
		hourlyRecords
	}: {
		maxUsers?: number;
		hourlyRecords: ParsedRecords['hourlyRecords'] | undefined;
	} = $props();

	const formatHour = (hour: number) => formatHourByLocale(hour);

	const getCellColor = (users: number | undefined) => {
		if (!users) {
			return 'transparent';
		}

		const intensity = users / maxUsers;
		return `hsla(24, 95%, 53%, ${intensity * 0.9})`;
	};

	const getRecordUsers = (day: WeekDay, hour: number) => {
		const dayRecords = hourlyRecords?.[day];
		if (!dayRecords) {
			return 0;
		}
		const record = dayRecords.find((r) => r.date.getHours() === hour);
		return record ? record.users : 0;
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
					{formatHour(hour)}
				</div>
			{/each}
		</div>

		<TooltipProvider>
			{#each weekDays as day}
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
										{day.slice(0, 3)} at {formatHour(hour)}
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
