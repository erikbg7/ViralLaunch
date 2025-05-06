<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { TimeFormat, weekDays } from '$lib/constants';
	import type { ParsedRecords } from '$lib/records/records.map';

	Chart.register(...registerables);

	type Props = {
		timeformat: TimeFormat;
		chartData: ParsedRecords['records'] | undefined;
	};

	let { chartData, timeformat }: Props = $props();

	// TODO: this might be wrong, need to check if the chartData is in UTC or local time
	let todayChartData = chartData?.[weekDays[new Date().getDay()]];

	if (!todayChartData) {
		todayChartData = [];
	}

	let currentDate = new Date();
	let currentHour = currentDate.getUTCHours();
	let currentMinute = currentDate.getUTCMinutes();

	let chartCanvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;

	function renderWeeklyChart() {
		if (chartInstance) chartInstance.destroy();

		const chartX = Array.from({ length: 72 }, (_, i) => i);

		function getRecordForX(x: number) {
			let day = Math.floor(x / 72);
			let hour = Math.floor((x % 72) / 3);
			let minute = [0, 20, 40][(x % 72) % 3];

			return todayChartData?.find((d) => {
				return d.date?.getHours() === hour && d.date?.getMinutes() === minute;
			});
		}

		chartInstance = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: chartX.map((x) => getRecordForX(x)?.hhmm || ''),
				datasets: [
					{
						label: 'Online Users',
						data: chartX.map((x) => getRecordForX(x)?.users || 0),
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

						let text = `${currentHour}:${String(currentMinute).padStart(2, '0')}`;
						ctx.beginPath();
						ctx.roundRect(x - 18, 22, ctx.measureText(text).width + 6, 18, 5);
						ctx.fill();
						ctx.clip();

						ctx.fillStyle = 'white';
						ctx.fillText(text, x - 15, 32);
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
					mode: 'nearest',
					intersect: false
				},
				scales: {
					x: {
						ticks: {
							callback: function (value, index) {
								console.log(value, index);
								let v = typeof value === 'string' ? parseInt(value) : value;

								if (v % 3 === 0) {
									const hour = Math.floor(v / 3);
									if (timeformat === TimeFormat.H24) {
										return `${hour.toString().padStart(2, '0')}h`;
									} else {
										const period = hour < 12 ? 'AM' : 'PM';
										const displayHour = hour % 12 === 0 ? 12 : hour % 12;
										return `${displayHour}${period}`;
									}
								}
								// Only show ticks on the hour
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
			}
		});
	}

	$effect(() => {
		if (!chartData) return;
		renderWeeklyChart();
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
	});
</script>

<canvas bind:this={chartCanvas} class="h-96 w-full"></canvas>
