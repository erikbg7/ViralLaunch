import { serverConfig } from '$lib/stores/settings.svelte';
import { formatHour } from '$lib/timeformat';

export class Formatter {
	// static weekDays =
	// 	serverConfig.weekstart === WeekStart.SUNDAY
	// 		? weekDaysSundayStart
	// 		: weekDaysMondayStart;

	static formatHour(hour: number) {
		return formatHour(hour, serverConfig.timeformat);
	}
}
