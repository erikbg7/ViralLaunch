import { serverConfig } from '$lib/stores/settings.svelte';
import { formatDateToHHMM, formatHour } from '$lib/timeformat';

export class Formatter {
	// static weekDays =
	// 	serverConfig.weekstart === WeekStart.SUNDAY
	// 		? weekDaysSundayStart
	// 		: weekDaysMondayStart;

	static formatHour(hour: number) {
		return formatHour(hour, serverConfig.timeformat);
	}

	static formatDateToHHMM(date: Date) {
		return formatDateToHHMM(date, serverConfig.timeformat);
	}
}
