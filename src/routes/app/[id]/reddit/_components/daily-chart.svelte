<script lang="ts" module>
	export type ChartType = 'daily' | 'weekly';
</script>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { subredditState } from '../store.svelte';
	import {
		aggregateToDailyAverages,
		aggregateToHourlyAverages,
		getDailyAverage
	} from '$lib/graph/aggregators';
	import { timeAgo } from '$lib/date';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index';
	import type { Subreddit } from '$lib/server/db/schema';

	Chart.register(...registerables);

	type Props = {
		subreddit: Subreddit;
		delete_subreddit_form_component: Snippet<[string]>;
		track_subreddit_form_component: Snippet<[Subreddit]>;
	};

	const {
		subreddit,
		delete_subreddit_form_component,
		track_subreddit_form_component
	}: Props = $props();

	let chartCanvas;
	let chartInstance;
	let chartData = [];
	let mounted = $state(false);
	let lastRecord = $state(0);
	let lastUpdate = $state('');
	let type = $state<ChartType>('daily');

	async function fetchData() {
		const response = await fetch(
			`/api/daily-stats?subredditId=${subreddit.id}`
		);
		const data = await response.json();
		chartData = data.results || [];

		lastRecord = data.lastRecord;
		lastUpdate = data.updatedAt;

		mounted = true;
	}

	function renderDailyChart() {
		if (chartInstance) chartInstance.destroy();

		const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

		const day = ((new Date().getUTCDay() + 6) % 7) + 1;
		// const data = getDailyAverage(chartData, day);
		const data = aggregateToHourlyAverages(chartData);

		chartInstance = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: hourLabels,
				datasets: [
					{
						label: 'Online Users',
						data: hourLabels.map(
							(_, i) => data.find((d) => d.hourOfDay === i)?.avgUsers || 0
						),
						borderColor: 'rgb(249,115,22)',
						backgroundColor: 'rgba(249,115,22, 0.5)',
						borderWidth: 2,
						tension: 0.4,
						pointRadius: 5
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		});
	}

	function renderWeeklyChart() {
		if (chartInstance) chartInstance.destroy();

		const data = aggregateToDailyAverages(chartData);

		const dayLabels = [
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday'
		];

		chartInstance = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: dayLabels,
				datasets: [
					{
						label: 'Avg Online Users',
						data: dayLabels.map(
							(_, i) => data.find((d) => d.dayOfWeek === i + 1)?.avgUsers || 0
						),
						borderColor: 'rgb(249,115,22)',
						backgroundColor: 'rgba(249,115,22, 0.5)',
						borderWidth: 2,
						tension: 0.4,
						pointRadius: 5
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		});
	}

	onMount(fetchData);

	$effect(() => {
		if (mounted) {
			if (type === 'daily') renderDailyChart();
			if (type === 'weekly') renderWeeklyChart();
		}
	});
</script>

<Card class="relative  shadow-xl">
	{@render track_subreddit_form_component(subreddit)}
	{@render delete_subreddit_form_component(String(subreddit.id))}

	<CardHeader>
		<CardTitle class="text-lg text-orange-500"
			><a href={`https://www.reddit.com/r/${subreddit.name}`} target="_blank"
				>r/{subreddit.name}</a
			></CardTitle
		>
	</CardHeader>
	<CardContent>
		<div class="flex justify-between">
			<span
				>{subredditState.onlineUsers} online users - {timeAgo(
					subredditState.lastUpdate
				)}</span
			>
			<span>
				<select
					class="rounded-md bg-orange-500/70 px-3 py-1 text-xs text-orange-900"
					bind:value={type}
				>
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
				</select>
			</span>
		</div>
		<div class="mx-auto max-h-[50vh] max-w-3xl rounded-2xl bg-white p-6">
			<canvas bind:this={chartCanvas} class="h-96 w-full"></canvas>
		</div>

		<div class="mt-2 flex justify-between">
			{#each ['12:05', '12:05', '12:05', '12:05'] as time}
				<div
					class="rounded-md bg-orange-500/70 px-3 py-1 text-xs text-orange-900"
				>
					{time}
				</div>
			{/each}
		</div>
	</CardContent>
</Card>
