export enum WeekDay {
	MONDAY = 'Monday',
	TUESDAY = 'Tuesday',
	WEDNESDAY = 'Wednesday',
	THURSDAY = 'Thursday',
	FRIDAY = 'Friday',
	SATURDAY = 'Saturday',
	SUNDAY = 'Sunday'
}

export const weekDays = [
	WeekDay.SUNDAY,
	WeekDay.MONDAY,
	WeekDay.TUESDAY,
	WeekDay.WEDNESDAY,
	WeekDay.THURSDAY,
	WeekDay.FRIDAY,
	WeekDay.SATURDAY
];

export enum ChartType {
	LINEAR = 'linear',
	HEATMAP = 'heatmap'
}

export enum TimeZones {
	UTC = 'UTC',
	EST = 'America/New_York',
	CST = 'America/Chicago',
	MST = 'America/Denver',
	PST = 'America/Los_Angeles',
	AKST = 'America/Anchorage',
	HST = 'Pacific/Honolulu',
	GMT = 'Europe/London',
	CET = 'Europe/Paris',
	EET = 'Europe/Helsinki',
	AST = 'Asia/Dubai',
	SGT = 'Asia/Singapore',
	JST = 'Asia/Tokyo',
	AEST = 'Australia/Sydney'
}

export const timezones = [
	{ value: 'UTC', label: 'UTC' },
	{ value: 'America/New_York', label: 'New York (UTC-5/UTC-4)' },
	{ value: 'America/Chicago', label: 'Chicago (UTC-6/UTC-5)' },
	{ value: 'America/Denver', label: 'Denver (UTC-7/UTC-6)' },
	{ value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8/UTC-7)' },
	{ value: 'America/Anchorage', label: 'Anchorage (UTC-9/UTC-8)' },
	{ value: 'Pacific/Honolulu', label: 'Honolulu (UTC-10)' },
	{ value: 'Europe/London', label: 'London (UTC+0/UTC+1)' },
	{ value: 'Europe/Paris', label: 'Paris (UTC+1/UTC+2)' },
	{ value: 'Europe/Helsinki', label: 'Helsinki (UTC+2/UTC+3)' },
	{ value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
	{ value: 'Asia/Singapore', label: 'Singapore (UTC+8)' },
	{ value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
	{ value: 'Australia/Sydney', label: 'Sydney (UTC+10/UTC+11)' }
];
