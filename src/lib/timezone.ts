// List of common timezones with their UTC offsets
export const timezones = [
	{ value: 'UTC', label: 'UTC', offset: 0 },
	{ value: 'America/New_York', label: 'New York (UTC-5/UTC-4)', offset: -5 },
	{ value: 'America/Chicago', label: 'Chicago (UTC-6/UTC-5)', offset: -6 },
	{ value: 'America/Denver', label: 'Denver (UTC-7/UTC-6)', offset: -7 },
	{
		value: 'America/Los_Angeles',
		label: 'Los Angeles (UTC-8/UTC-7)',
		offset: -8
	},
	{ value: 'America/Anchorage', label: 'Anchorage (UTC-9/UTC-8)', offset: -9 },
	{ value: 'Pacific/Honolulu', label: 'Honolulu (UTC-10)', offset: -10 },
	{ value: 'Europe/London', label: 'London (UTC+0/UTC+1)', offset: 0 },
	{ value: 'Europe/Paris', label: 'Paris (UTC+1/UTC+2)', offset: 1 },
	{ value: 'Europe/Helsinki', label: 'Helsinki (UTC+2/UTC+3)', offset: 2 },
	{ value: 'Asia/Dubai', label: 'Dubai (UTC+4)', offset: 4 },
	{ value: 'Asia/Singapore', label: 'Singapore (UTC+8)', offset: 8 },
	{ value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)', offset: 9 },
	{ value: 'Australia/Sydney', label: 'Sydney (UTC+10/UTC+11)', offset: 10 }
];

export function formatHourByLocale(hour: number, locale = navigator.language) {
	const date = new Date(Date.UTC(2000, 0, 1, hour, 0)); // fixed dummy date
	const formatter = new Intl.DateTimeFormat(locale, {
		hour: 'numeric',
		hour12: undefined, // let system/browser decide
		timeZone: 'UTC'
	});
	return formatter.format(date);
}

// Get the current week days in the user's timezone
export function getWeekDaysInUserTimezone() {
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const formatter = new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		timeZone
	});

	// Start from a known Monday (e.g., 2025-04-07)
	const start = new Date(Date.UTC(2025, 3, 6)); // April 6, 2025 is a Monday
	const days = [];

	for (let i = 0; i < 7; i++) {
		const date = new Date(start);
		date.setUTCDate(start.getUTCDate() + i);
		days.push(formatter.format(date));
	}

	return days;
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
