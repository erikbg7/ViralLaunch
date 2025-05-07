import { TimeZone, timezones } from '$lib/constants';

// Get the user's local timezone
export function getUserTimezone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	} catch (e) {
		return 'UTC';
	}
}

// Get timezone label from value
export function getTimezoneLabel(timezoneValue: string): string {
	const timezone = timezones.find((tz) => tz.value === timezoneValue);
	return timezone ? timezone.label : timezoneValue;
}

export function floorTo20Minutes(date: Date) {
	const ms = date.getTime();
	const interval = 20 * 60 * 1000; // 20 minutes in milliseconds
	const flooredMs = Math.floor(ms / interval) * interval;
	return new Date(flooredMs);
}

export function getIntervalFromDate(date: Date) {
	const flooredDate = floorTo20Minutes(date);
	const hours = flooredDate.getUTCHours();
	const minutes = flooredDate.getUTCMinutes();
	const interval = Math.floor((hours * 60 + minutes) / 20);
	return interval;
}

export function getDateInTimezone(timeZone: TimeZone): Date {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});

	const parts = formatter.formatToParts(new Date());
	const obj = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

	return new Date(
		`${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.minute}:${obj.second}`
	);
}
