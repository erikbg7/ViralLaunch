import { weekDaysMondayStart, weekDaysSundayStart } from '$lib/constants';
// TODO
// settings store should get all the information from the user preferences when the app is loaded,
// then we save it onto this store so we can use it along the app

import { TimeFormat, TimeZone, WeekStart } from '$lib/constants';
import { writable } from 'svelte/store';

export type ServerConfig = { timezone: string };

export const serverConfig2 = writable<ServerConfig>({
	timezone: TimeZone.CET
});

const createServerConfig = () => {
	let timezone = $state<TimeZone>(TimeZone.CET);
	let timeformat = $state<TimeFormat>(TimeFormat.AM_PM);
	let weekstart = $state<WeekStart>(WeekStart.SUNDAY);

	let weekDays = $derived(
		weekstart === WeekStart.SUNDAY ? weekDaysSundayStart : weekDaysMondayStart
	);

	let dateFormatter = $derived.by(() => {
		return new Intl.DateTimeFormat('en-US', {
			timeZone: timezone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	});

	return {
		get timezone() {
			return timezone;
		},
		set timezone(value: TimeZone) {
			timezone = value;
		},
		get dateFormatter() {
			return dateFormatter;
		},
		get timeformat() {
			return timeformat;
		},
		set timeformat(value: TimeFormat) {
			timeformat = value;
		},
		get weekstart() {
			return weekstart;
		},
		set weekstart(value: WeekStart) {
			weekstart = value;
		},
		get weekdays() {
			return weekDays;
		}
	};
};

const serverConfig = createServerConfig();
export { serverConfig };
