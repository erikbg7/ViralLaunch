<script>
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { subredditState } from '../store.svelte';

	Chart.register(...registerables);

	const { subredditId } = $props();

	let chartCanvas;
	let chartInstance;

	let chartData = [];

	async function fetchData() {
		const response = await fetch(`/api/daily-stats?subredditId=${subredditId}`);
		const data = await response.json();
		chartData = data.results || [];

		subredditState.onlineUsers = data.lastRecord;
		subredditState.lastUpdate = data.updatedAt;

		renderChart();
	}

	function renderChart() {
		if (chartInstance) chartInstance.destroy();

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
							(_, i) => chartData.find((d) => d.dayOfWeek === i + 1)?.avgUsers || 0
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
</script>

<div class="mx-auto max-h-[50vh] max-w-3xl rounded-2xl bg-white p-6">
	<canvas bind:this={chartCanvas} class="h-96 w-full"></canvas>
</div>
