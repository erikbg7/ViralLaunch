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

// Get timezone offset in hours
export function getTimezoneOffset(timezoneValue: string): number {
	const timezone = timezones.find((tz) => tz.value === timezoneValue);
	return timezone ? timezone.offset : 0;
}

// Adjust time data based on timezone difference
export function adjustTimeData(
	data: any[],
	fromTimezone: string,
	toTimezone: string
) {
	const fromOffset = getTimezoneOffset(fromTimezone);
	const toOffset = getTimezoneOffset(toTimezone);
	const hourDifference = toOffset - fromOffset;

	// If no difference or invalid timezones, return original data
	if (hourDifference === 0) {
		return data;
	}

	// For our time-of-day data, we need to shift the time periods
	return data.map((dayData) => {
		// Deep copy to avoid modifying original
		const newData = { ...dayData };

		// Shift data based on hour difference
		// Our time periods are: morning (6-12), afternoon (12-18), evening (18-24), night (0-6)
		if (hourDifference > 0) {
			// Moving east (e.g., from New York to London)
			if (hourDifference >= 6) {
				// Complete shift of time periods
				newData.morning = dayData.night;
				newData.afternoon = dayData.morning;
				newData.evening = dayData.afternoon;
				newData.night = dayData.evening;
			} else if (hourDifference >= 3) {
				// Partial shift - blend adjacent time periods
				newData.morning = Math.round((dayData.night * 2 + dayData.morning) / 3);
				newData.afternoon = Math.round(
					(dayData.morning * 2 + dayData.afternoon) / 3
				);
				newData.evening = Math.round(
					(dayData.afternoon * 2 + dayData.evening) / 3
				);
				newData.night = Math.round((dayData.evening * 2 + dayData.night) / 3);
			} else {
				// Minor shift - slight blend
				newData.morning = Math.round((dayData.night + dayData.morning * 2) / 3);
				newData.afternoon = Math.round(
					(dayData.morning + dayData.afternoon * 2) / 3
				);
				newData.evening = Math.round(
					(dayData.afternoon + dayData.evening * 2) / 3
				);
				newData.night = Math.round((dayData.evening + dayData.night * 2) / 3);
			}
		} else {
			// Moving west (e.g., from London to New York)
			const absDiff = Math.abs(hourDifference);
			if (absDiff >= 6) {
				// Complete shift of time periods
				newData.morning = dayData.evening;
				newData.afternoon = dayData.night;
				newData.evening = dayData.morning;
				newData.night = dayData.afternoon;
			} else if (absDiff >= 3) {
				// Partial shift - blend adjacent time periods
				newData.morning = Math.round(
					(dayData.evening * 2 + dayData.morning) / 3
				);
				newData.afternoon = Math.round(
					(dayData.night * 2 + dayData.afternoon) / 3
				);
				newData.evening = Math.round(
					(dayData.morning * 2 + dayData.evening) / 3
				);
				newData.night = Math.round((dayData.afternoon * 2 + dayData.night) / 3);
			} else {
				// Minor shift - slight blend
				newData.morning = Math.round(
					(dayData.evening + dayData.morning * 2) / 3
				);
				newData.afternoon = Math.round(
					(dayData.night + dayData.afternoon * 2) / 3
				);
				newData.evening = Math.round(
					(dayData.morning + dayData.evening * 2) / 3
				);
				newData.night = Math.round((dayData.afternoon + dayData.night * 2) / 3);
			}
		}

		return newData;
	});
}
