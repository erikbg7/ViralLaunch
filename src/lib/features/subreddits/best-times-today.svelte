<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import Users from '@lucide/svelte/icons/users';
	import Clock from '@lucide/svelte/icons/clock';
	import type { ParsedRecords } from '$lib/records/records.map';

	let { bestTimes }: { bestTimes: ParsedRecords['bestTodayTimes'] } = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			User Peaks Today
			<Clock class="h-4 w-4 text-muted-foreground" />
		</CardTitle>
		<CardDescription>Top 4 hours with the most users</CardDescription>
	</CardHeader>
	<CardContent>
		{#if bestTimes.filter(Boolean).length === 0}
			<div class="flex h-32 items-center justify-center">
				<p class="text-muted-foreground">Loading data...</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-4">
				{#each bestTimes.slice(0, 4) as bestTime, index}
					<div
						class="flex flex-col items-center justify-center rounded-lg p-4 text-center"
						style={`background-color: hsl(${24 + index * 3}, ${95 - index * 5}%, ${95 - index * 3}%); border: 1px solid hsl(${24 + index * 3}, ${95 - index * 5}%, ${85 - index * 3}%)`}
					>
						<div class="mb-1 text-2xl font-bold">
							{bestTime.hhmm ?? 'No data'}
						</div>
						<div class="flex items-center gap-1 text-sm font-medium">
							<Users class="h-3.5 w-3.5" />
							<span>{bestTime?.users || 'unknown'} users</span>
						</div>
						<div
							class="mt-2 rounded-full px-2 py-0.5 text-xs"
							style={`background-color: hsl(${24 + index * 3}, ${95 - index * 5}%, ${50 + index * 5}%); color: ${index < 2 ? 'white' : 'inherit'}`}
						>
							#{index + 1} Peak
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
