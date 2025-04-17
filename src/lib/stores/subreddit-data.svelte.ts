import { weekDays, WeekDay } from '$lib/constants';
import type { RouterOutput } from '$lib/server/trpc/router';
import { serverConfig } from '$lib/stores/settings.svelte';

type RawRecords = RouterOutput['records']['get2'];

// TODO: Daily records should no have an interval, as it could be missleading because does not tak einto account user timezone.
// For example, 23:20 UTC would have interval 70, but in UTC+2 it would be 01:20 interval 70. Which would result in a
// improper sorting of the records.
// WE SHOULD ALWAYS PREDEFINE WHAT WE WANT TO SHOW BASED ON DAY, HOUR AND INTERVAL.
// THEN FIND A RECORD LOOKING AT ITS DATE AND TIME.
export type DailyRecord = {
	date: Date;
	interval: number;
	users: number;
};

export type ParsedRecords = {
	peakWeeklyUsers: number;
	peakTodayUsers: number;
	bestTodayTimes: DailyRecord[];
	bestWeeklyTimes: { date: Date; users: number }[];
	records: Record<WeekDay, DailyRecord[]>;
	hourlyRecords: Record<WeekDay, DailyRecord[]>;
};

export function aggregateToHeatmapRecords(
	parsedRecords: Record<WeekDay, DailyRecord[]>
): Record<WeekDay, DailyRecord[]> {
	let recordsClone = { ...parsedRecords };

	for (const weekday in recordsClone) {
		const dailyRecords = parsedRecords[weekday as WeekDay];
		const dailyRecordByHour: DailyRecord[] = [];

		for (let i = 0; i < dailyRecords.length; i += 3) {
			let i1 = dailyRecords[i]?.users || 0;
			let i2 = dailyRecords[i + 1]?.users || 0;
			let i3 = dailyRecords[i + 2]?.users || 0;

			let avg = Math.ceil((i1 + i2 + i3) / 3);

			dailyRecordByHour.push({
				date: dailyRecords[i]?.date,
				interval: dailyRecords[i]?.interval,
				users: avg
			});
		}

		recordsClone[weekday as WeekDay] = dailyRecordByHour;
	}
	return recordsClone;
}

export function mapRecords(raw_records: RawRecords): ParsedRecords {
	let peakWeeklyUsers = 0;
	let peakTodayUsers = 0;

	let records: ParsedRecords['records'] = {
		[WeekDay.MONDAY]: [],
		[WeekDay.TUESDAY]: [],
		[WeekDay.WEDNESDAY]: [],
		[WeekDay.THURSDAY]: [],
		[WeekDay.FRIDAY]: [],
		[WeekDay.SATURDAY]: [],
		[WeekDay.SUNDAY]: []
	};

	let mostUsersByDay: Record<WeekDay, DailyRecord> = {
		[WeekDay.MONDAY]: { users: 0 } as DailyRecord,
		[WeekDay.TUESDAY]: { users: 0 } as DailyRecord,
		[WeekDay.WEDNESDAY]: { users: 0 } as DailyRecord,
		[WeekDay.THURSDAY]: { users: 0 } as DailyRecord,
		[WeekDay.FRIDAY]: { users: 0 } as DailyRecord,
		[WeekDay.SATURDAY]: { users: 0 } as DailyRecord,
		[WeekDay.SUNDAY]: { users: 0 } as DailyRecord
	};

	const todayIndex = new Date().getDay();
	let todayRecords: DailyRecord[] = [];

	for (const r of raw_records) {
		peakWeeklyUsers = Math.max(peakWeeklyUsers, r.users);

		const localDate = new Date(
			serverConfig.dateFormatter.format(Date.parse(r.timestamp))
		);

		const day = localDate.getDay();
		const weekday = weekDays[day];

		let record: DailyRecord = {
			date: localDate,
			interval: r.interval,
			users: r.users
		};

		if (todayIndex === day) {
			peakTodayUsers = Math.max(peakTodayUsers, record.users);
			todayRecords.push(record);
		}
		if (record.users > mostUsersByDay[weekday].users) {
			mostUsersByDay[weekday] = record;
		}

		records[weekday].push(record);
	}

	let hourlyRecordsByDay = aggregateToHeatmapRecords(records);

	let bestTodayTimes = hourlyRecordsByDay[weekDays[todayIndex]]
		.sort((a, b) => b.users - a.users)
		.slice(0, 4);

	return {
		peakWeeklyUsers,
		peakTodayUsers,
		bestTodayTimes,
		bestWeeklyTimes: Object.values(mostUsersByDay),
		records,
		hourlyRecords: hourlyRecordsByDay
	};
}
