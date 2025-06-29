export enum WeekStart {
	SUNDAY = 'Sunday',
	MONDAY = 'Monday'
}

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

export const weekDaysSundayStart = [
	WeekDay.SUNDAY,
	WeekDay.MONDAY,
	WeekDay.TUESDAY,
	WeekDay.WEDNESDAY,
	WeekDay.THURSDAY,
	WeekDay.FRIDAY,
	WeekDay.SATURDAY
];
export const weekDaysMondayStart = [
	WeekDay.MONDAY,
	WeekDay.TUESDAY,
	WeekDay.WEDNESDAY,
	WeekDay.THURSDAY,
	WeekDay.FRIDAY,
	WeekDay.SATURDAY,
	WeekDay.SUNDAY
];

export enum ChartType {
	WEEKLY = 'weekly',
	DAILY = 'daily'
}

export enum NotificationFrequency {
	NEVER = 'never',
	DAILY = 'daily',
	WEEKLY = 'weekly'
}

export const notificationHours = Array.from({ length: 48 }, (_, i) => {
	const hour = Math.floor(i / 2);
	const minute = i % 2 === 0 ? '00' : '30';
	return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export enum TimeFormat {
	AM_PM = 'am_pm',
	H24 = 'h24'
}

export enum TimeZone {
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
	{ value: TimeZone.UTC, label: 'UTC' },
	{ value: TimeZone.EST, label: 'New York (UTC-5/UTC-4)' },
	{ value: TimeZone.CST, label: 'Chicago (UTC-6/UTC-5)' },
	{ value: TimeZone.MST, label: 'Denver (UTC-7/UTC-6)' },
	{ value: TimeZone.PST, label: 'Los Angeles (UTC-8/UTC-7)' },
	{ value: TimeZone.AKST, label: 'Anchorage (UTC-9/UTC-8)' },
	{ value: TimeZone.HST, label: 'Honolulu (UTC-10)' },
	{ value: TimeZone.GMT, label: 'London (UTC+0/UTC+1)' },
	{ value: TimeZone.CET, label: 'Paris (UTC+1/UTC+2)' },
	{ value: TimeZone.EET, label: 'Helsinki (UTC+2/UTC+3)' },
	{ value: TimeZone.AST, label: 'Dubai (UTC+4)' },
	{ value: TimeZone.SGT, label: 'Singapore (UTC+8)' },
	{ value: TimeZone.JST, label: 'Tokyo (UTC+9)' },
	{ value: TimeZone.AEST, label: 'Sydney (UTC+10/UTC+11)' }
];
