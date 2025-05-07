<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { TimeFormat, TimeZone, WeekDay, weekDays } from '$lib/constants';
	import type { DailyRecord, ParsedRecords } from '$lib/records/records.map';
	import { formatDateToHHMM, getDateInTimezone } from '$lib/timezone';

	Chart.register(...registerables);

	type Props = {
		weekdays: WeekDay[];
		timeformat: TimeFormat;
		timezone: TimeZone;
		chartData: ParsedRecords['records'] | undefined;
	};

	let {
		chartData,
		weekdays,
		timeformat = $bindable(),
		timezone = $bindable()
	}: Props = $props();

	let chartCanvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;
	let intervalId: NodeJS.Timeout | null = null;

	function renderWeeklyChart() {
		if (chartInstance) chartInstance.destroy();

		const chartX = Array.from({ length: 504 }, (_, i) => i);

		function getRecordForX(x: number) {
			let day = Math.floor(x / 72);
			let hour = Math.floor((x % 72) / 3);
			let minute = [0, 20, 40][(x % 72) % 3];

			return chartData?.[weekdays[day]]?.find((d) => {
				return d.date?.getHours() === hour && d.date?.getMinutes() === minute;
			});
		}

		function formatRecordDate(record: DailyRecord | undefined) {
			if (!record) return '';
			let dayDisplay = weekdays[record.date.getDay()];

			if (timeformat === TimeFormat.H24) {
				return `${dayDisplay} ${String(record.date?.getHours()).padStart(2, '0')}:${String(
					record.date?.getMinutes()
				).padStart(2, '0')}h`;
			} else {
				let hourDisplay = record.date?.getHours();
				let minuteDisplay = record.date?.getMinutes();
				let ampm = hourDisplay >= 12 ? 'PM' : 'AM';

				return `${dayDisplay} ${String(hourDisplay).padStart(2, '0')}:${String(
					minuteDisplay
				).padStart(2, '0')} ${ampm}`;
			}
		}

		chartInstance = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: chartX.map((x) => formatRecordDate(getRecordForX(x))),
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
						const dayName = weekDays[currentDate.getDay()];
						const currentDay = weekdays.indexOf(dayName);
						const currentHourValue =
							currentDay * 24 * 3 + currentHour * 3 + currentMinute / 60;
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
						const dayName = weekDays[currentDate.getDay()];
						const currentDay = weekdays.indexOf(dayName);
						const currentHourValue =
							currentDay * 24 * 3 + currentHour * 3 + currentMinute / 60;

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

								if (v % 72 === 0) {
									return weekdays[Math.floor(v / 72)];
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

		intervalId = setInterval(() => {
			chartInstance?.update('none'); // 'none' to prevent animation
		}, 10000); // Update every 10 seconds
	}

	$effect(() => {
		if (!chartData) return;
		if (intervalId) clearInterval(intervalId);
		renderWeeklyChart();

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
