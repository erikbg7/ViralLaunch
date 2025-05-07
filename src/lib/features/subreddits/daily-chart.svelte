<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { TimeFormat, TimeZone, weekDays } from '$lib/constants';
	import type { ParsedRecords } from '$lib/records/records.map';
	import { formatDateToHHMM, getDateInTimezone } from '$lib/timezone';

	Chart.register(...registerables);

	type Props = {
		timeformat: TimeFormat;
		timezone: TimeZone;
		chartData: ParsedRecords['records'] | undefined;
	};

	let { chartData, timeformat, timezone }: Props = $props();

	let date = getDateInTimezone(timezone);
	let todayChartData = chartData?.[weekDays[date.getDay()]];

	if (!todayChartData) {
		todayChartData = [];
	}

	let chartCanvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;
	let intervalId: NodeJS.Timeout | null = null;

	function renderDailyChart() {
		if (chartInstance) chartInstance.destroy();

		const chartX = Array.from({ length: 72 }, (_, i) => i);

		function getRecordForX(x: number) {
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
						let currentDate = getDateInTimezone(timezone);
						let currentHour = currentDate.getHours();
						let currentMinute = currentDate.getMinutes();
						const currentHourValue = currentHour * 3 + currentMinute / 60;
						const x = chart.scales.x.getPixelForValue(currentHourValue);
						ctx.save();
						// add bold font
						ctx.font = '12px Arial';
						ctx.fillStyle = 'red';

						let text = formatDateToHHMM(currentDate, timezone, timeformat);
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
						let currentDate = getDateInTimezone(timezone);
						let currentHour = currentDate.getHours();
						let currentMinute = currentDate.getMinutes();
						const currentHourValue = currentHour * 3 + currentMinute / 60;
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
								// Only show ticks on the hours
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

		intervalId = setInterval(() => {
			chartInstance?.update('none'); // 'none' to prevent animation
		}, 10000); // Update every 10 seconds
	}

	$effect(() => {
		if (!chartData) return;
		if (intervalId) clearInterval(intervalId);
		renderDailyChart();

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
		if (intervalId) clearInterval(intervalId);
	});
</script>

<canvas bind:this={chartCanvas} class="h-96 w-full"></canvas>
