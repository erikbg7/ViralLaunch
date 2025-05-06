<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import BestTimesToday from '$lib/features/subreddits/best-times-today.svelte';
	import type { ParsedRecords } from '$lib/records/records.map';

	export type DailyReportProps = {
		bestTimes: ParsedRecords['bestTodayTimes'];
	};

	let { bestTimes }: DailyReportProps = $props();
</script>

<h1 class="bg-green-400 text-black">This is the daily report</h1>

<Button onclick={() => alert('hello mellow')}>Will this work???</Button>
<BestTimesToday {bestTimes} />
