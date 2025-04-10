<script lang="ts">
	import { aggregateToHourlyAverages } from '$lib/graph/aggregators';
	import type { SubredditRecord } from '$lib/server/db/schema';
	import { Chart, registerables } from 'chart.js';
	import { onDestroy } from 'svelte';

	Chart.register(...registerables);

	type Props = {
		chartData: SubredditRecord[];
		loading?: boolean;
	};

	let { chartData = $bindable(), loading = false }: Props = $props();

	let currentDate = new Date();
	let currentHour = currentDate.getUTCHours();
	let currentMinute = currentDate.getUTCMinutes();

	let chartCanvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;

	function renderDailyChart() {
		if (chartInstance) chartInstance.destroy();

		function intervalToHourString(i: number) {
			const hour = Math.floor(i / 3);
			const minute = (i % 3) * 20;
			return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
		}

		const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
		const intervals = Array.from({ length: 72 }, (_, i) =>
			intervalToHourString(i)
		);

		console.log({ intervals });

		chartInstance = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: intervals,
				datasets: [
					{
						label: 'Online Users',
						data: intervals.map(
							(_, i) => chartData.find((d) => d.interval === i)?.users || 0
						),
						borderColor: 'rgb(249,115,22)',
						backgroundColor: 'rgba(249,115,22, 0.5)',
						borderWidth: 2,
						tension: 0.4
						// pointRadius: 5
					}
				]
			},

			plugins: [
				{
					id: 'current-time-indicator',
					afterDraw(chart) {
						const ctx = chart.ctx;
						const currentHourValue = currentHour + currentMinute / 60;
						const x = chart.scales.x.getPixelForValue(currentHourValue);
						ctx.save();
						// add bold font
						ctx.font = '12px Arial';
						ctx.fillStyle = 'red';
						// ctx.fillText(
						// 	`${currentHour}:${String(currentMinute).padStart(2, '0')}`,
						// 	x - 15,
						// 	30
						// );
						// fill text background with black and rounded borders
						ctx.beginPath();
						ctx.roundRect(
							x - 18,
							22,
							ctx.measureText(
								`${currentHour}:${String(currentMinute).padStart(2, '0')}`
							).width + 6,
							18,
							5
						);
						ctx.fill();
						ctx.clip();

						ctx.fillStyle = 'white';
						ctx.fillText(
							`${currentHour}:${String(currentMinute).padStart(2, '0')}`,
							x - 15,
							32
						);
						ctx.restore();
					},

					beforeDraw(chart) {
						const ctx = chart.ctx;
						const currentHourValue = currentHour + currentMinute / 60;
						const x = chart.scales.x.getPixelForValue(currentHourValue);
						ctx.save();
						ctx.beginPath();
						ctx.moveTo(x, chart.height * 0.1);
						ctx.lineTo(x, chart.height - chart.height * 0.1);
						ctx.strokeStyle = 'red';
						ctx.lineWidth = 1;
						ctx.stroke();
						ctx.restore();
					}
				}
			],
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'x',
					intersect: false
				},
				scales: {
					x: {
						ticks: {
							callback: function (value, index) {
								const label = this.getLabelForValue(index);
								// Only show ticks on the hour
								return label.endsWith(':00') ? label : '';
							},
							autoSkip: false, // Ensures all labels are checked for skipping
							maxRotation: 0,
							minRotation: 0
						},
						title: {
							display: true,
							text: 'Hour of Day'
						}
					},
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Users'
						}
					}
				}
				// scales: {
				// 	x: {
				// 		ticks: {
				// 			// For a category axis, the val is the index so the lookup via getLabelForValue is needed
				// 			callback: function (val, index) {
				// 				// Hide every 2nd tick label
				// 				// console.log({ val });
				// 				return intervalToHourString(parseInt(val));
				// 				return index % 3 === 0
				// 					? intervalToHourString(parseInt(val))
				// 					: '';
				// 			}
				// 		}
				// 	}
				// }
			}
		});
	}

	$effect(() => {
		renderDailyChart();
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
	});
</script>

<canvas bind:this={chartCanvas} class="h-96 w-full"></canvas>
