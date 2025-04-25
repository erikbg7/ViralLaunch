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
	LINEAR = 'linear',
	HEATMAP = 'heatmap'
}

export enum NotificationFrequency {
	NEVER = 'never',
	DAILY = 'daily',
	WEEKLY = 'weekly'
}

export const notificationHours = [
	'00:00',
	'00:30',
	'01:00',
	'01:30',
	'02:00',
	'02:30',
	'03:00',
	'03:30',
	'04:00',
	'04:30',
	'05:00',
	'05:30',
	'06:00',
	'06:30',
	'07:00',
	'07:30',
	'08:00',
	'08:30',
	'09:00',
	'09:30',
	'10:00',
	'10:30',
	'11:00',
	'11:30',
	'12:00',
	'12:30',
	'13:00',
	'13:30',
	'14:00',
	'14:30',
	'15:00',
	'15:30',
	'16:00',
	'16:30',
	'17:00',
	'17:30',
	'18:00',
	'18:30',
	'19:00',
	'19:30',
	'20:00',
	'20:30',
	'21:00',
	'21:30',
	'22:00',
	'22:30',
	'23:00',
	'23:30'
];

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
