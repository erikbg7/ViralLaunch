import {
	NotificationFrequency,
	WeekDay,
	weekDaysMondayStart,
	weekDaysSundayStart
} from '$lib/constants';
// TODO
// settings store should get all the information from the user preferences when the app is loaded,
// then we save it onto this store so we can use it along the app

import { TimeFormat, TimeZone, WeekStart } from '$lib/constants';
import type { RouterOutput } from '$lib/server/trpc/router';
import { writable } from 'svelte/store';

export type ServerConfig = { timezone: string };

export const serverConfig2 = writable<ServerConfig>({
	timezone: TimeZone.CET
});

const createServerConfig = () => {
	let loading = $state<boolean>(true);

	let _timezone = $state<TimeZone>(TimeZone.CET);
	let _timeformat = $state<TimeFormat>(TimeFormat.AM_PM);
	let _weekstart = $state<WeekStart>(WeekStart.SUNDAY);
	let _notificationDay = $state<WeekDay>(WeekDay.MONDAY);
	let _notificationTime = $state<string>('08:30');
	let _notificationEmail = $state<string>('');
	let _notificationFrequency = $state<NotificationFrequency>(
		NotificationFrequency.NEVER
	);

	let timezone = $state<TimeZone>(TimeZone.CET);
	let timeformat = $state<TimeFormat>(TimeFormat.AM_PM);
	let weekstart = $state<WeekStart>(WeekStart.SUNDAY);
	let notificationDay = $state<WeekDay>(WeekDay.MONDAY);
	let notificationTime = $state<string>('08:30');
	let notificationEmail = $state<string>('');
	let notificationFrequency = $state<NotificationFrequency>(
		NotificationFrequency.NEVER
	);

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
			second: '2-digit',
			hour12: timeformat === TimeFormat.AM_PM
		});
	});

	return {
		init(data: RouterOutput['preferences']['get']) {
			_timezone = data.timezone;
			timezone = data.timezone;

			_timeformat = data.timeformat;
			timeformat = data.timeformat;

			_weekstart = data.weekstart;
			weekstart = data.weekstart;

			_notificationDay = data.notificationDay;
			notificationDay = data.notificationDay;

			_notificationTime = data.notificationTime;
			notificationTime = data.notificationTime;

			_notificationFrequency = data.notificationFrequency;
			notificationFrequency = data.notificationFrequency;

			_notificationEmail = data.notificationEmail;
			notificationEmail = data.notificationEmail;
		},
		reset() {
			timezone = _timezone;
			timeformat = _timeformat;
			weekstart = _weekstart;
			notificationDay = _notificationDay;
			notificationTime = _notificationTime;
			notificationFrequency = _notificationFrequency;
			notificationEmail = _notificationEmail;
		},

		get hasChanges() {
			return (
				_timezone !== timezone ||
				_timeformat !== timeformat ||
				_weekstart !== weekstart ||
				_notificationDay !== notificationDay ||
				_notificationTime !== notificationTime ||
				_notificationFrequency !== notificationFrequency ||
				_notificationEmail !== notificationEmail
			);
		},
		get loading() {
			return loading;
		},
		set loading(value: boolean) {
			loading = value;
		},
		get notificationDay() {
			return notificationDay;
		},
		set notificationDay(value: WeekDay) {
			notificationDay = value;
		},
		get notificationTime() {
			return notificationTime;
		},
		set notificationTime(value: string) {
			notificationTime = value;
		},
		get notificationEmail() {
			return notificationEmail;
		},
		set notificationEmail(value: string) {
			notificationEmail = value;
		},
		get notificationFrequency() {
			return notificationFrequency;
		},
		set notificationFrequency(value: NotificationFrequency) {
			notificationFrequency = value;
		},
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
