import { timezones } from '$lib/constants';

/**
 * Formats a UTC date according to a specific IANA timezone.
 * @param utcDate - The original UTC Date.
 * @param timeZone - The IANA timezone identifier (e.g. 'America/New_York').
 * @returns A string representing the formatted local date/time.
 */
export function formatUTCToLocal(
	utcDate: Date | number,
	timeZone: string
): string {
	// If times are not correctly converted, try adding a Z to the date string to force UTC parsing
	return new Intl.DateTimeFormat('en-US', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	}).format(utcDate);
}

/**
 * Converts a UTC Date to a local Date by applying the given offset.
 * @param utcDate - The original UTC date.
 * @param offset - Timezone offset in hours (e.g., -5 for New York standard time).
 * @returns A new Date object adjusted by the offset.
 */
export function convertUTCToLocal(utcDate: Date, offset: number): Date {
	// Convert offset hours to milliseconds and add to UTC time.
	return new Date(utcDate.getTime() + offset * 60 * 60 * 1000);
}

export function convertTimestampToLocalDate(
	utcTimestamp: string,
	offset: number
): Date {
	const utcDate = new Date(utcTimestamp);
	const utcDate2 = new Date(`${utcTimestamp}Z`);
	console.log({ utcTimestamp, utcDate, utcDate2, offset });
	// Convert offset hours to milliseconds and add to UTC time.
	return new Date(utcDate.getTime() + offset * 60 * 60 * 1000);
}

export function formatHourByLocale(hour: number, locale = navigator.language) {
	const date = new Date(Date.UTC(2000, 0, 1, hour, 0)); // fixed dummy date
	const formatter = new Intl.DateTimeFormat(locale, {
		hour: 'numeric',
		hour12: undefined, // let system/browser decide
		timeZone: 'UTC'
	});
	return formatter.format(date);
}

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
