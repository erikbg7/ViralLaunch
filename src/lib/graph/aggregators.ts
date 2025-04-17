import type { WeeklySubredditRecords } from '$lib/server/db/schema';

type HourlyData = {
	dayOfWeek: number;
	hourOfDay: number;
	lastRecord: number;
	updatedAt: Date;
	avgUsers: number;
};

type DailyAverage = {
	dayOfWeek: HourlyData['dayOfWeek'];
	avgUsers: HourlyData['avgUsers'];
};

type HourlyAverage = {
	hourOfDay: HourlyData['hourOfDay'];
	avgUsers: HourlyData['avgUsers'];
};

export function getDailyAverage(
	hourlyData: HourlyData[],
	dayOfWeek: HourlyData['dayOfWeek']
): HourlyData[] {
	return hourlyData.filter((d) => d.dayOfWeek === dayOfWeek);
}

export function aggregateToDailyAverages(
	hourlyData: HourlyData[]
): DailyAverage[] {
	const dailyStats: Record<number, { totalUsers: number; count: number }> = {};

	for (const { dayOfWeek, avgUsers } of hourlyData) {
		if (!dailyStats[dayOfWeek]) {
			dailyStats[dayOfWeek] = { totalUsers: 0, count: 0 };
		}

		dailyStats[dayOfWeek].totalUsers += avgUsers;
		dailyStats[dayOfWeek].count += 1;
	}

	return Object.entries(dailyStats).map(([day, stats]) => ({
		dayOfWeek: Number(day),
		avgUsers: Math.ceil(stats.totalUsers / stats.count)
	}));
}

export function aggregateToHourlyAverages(
	hourlyData: HourlyData[]
): HourlyAverage[] {
	const hourlyStats: Record<
		HourlyData['hourOfDay'],
		{ totalUsers: number; count: number }
	> = {};

	for (const { hourOfDay, avgUsers } of hourlyData) {
		if (!hourlyStats[hourOfDay]) {
			hourlyStats[hourOfDay] = { totalUsers: 0, count: 0 };
		}

		hourlyStats[hourOfDay].totalUsers += avgUsers;
		hourlyStats[hourOfDay].count += 1;
	}

	return Object.entries(hourlyStats).map(([key, stats]) => {
		return {
			hourOfDay: parseInt(key),
			avgUsers: Math.ceil(stats.totalUsers / stats.count)
		};
	});
}

export function getCurrentLastRecord(
	hourlyData: HourlyData[]
): HourlyData | undefined {
	const hourOfDay = new Date().getUTCHours();
	const dayOfWeek = ((new Date().getUTCDay() + 6) % 7) + 1;

	const hourlyRecord = hourlyData.find(
		(d) => d.dayOfWeek === dayOfWeek && d.hourOfDay === hourOfDay
	);

	return hourlyRecord;
}

// async function getDailyGraphData(subredditId: number, weekStartDate: string) {
//     const hourlyData = await getHourlyGraphData(subredditId, weekStartDate);
//     return aggregateToDailyAverages(hourlyData);
//   }

const INTERVALS_IN_HOUR = 3; // 20 minutes intervals
const INTERVALS_IN_DAY = 24 * INTERVALS_IN_HOUR; // 24 hours
const INTERVALS_IN_WEEK = 7 * INTERVALS_IN_DAY; // 7 days

export type DayRecordByHour = {
	day: number;
	records: Array<{ hour: number; users: number }>;
};

export type WeeklyRecordsByHour = {
	maxUsers: number;
	dailyRecordsByHour: Array<DayRecordByHour>;
};

function getPeakUsersRecord(r: DayRecordByHour) {
	return r.records.reduce((acc, record) => {
		if (!acc || record.users > acc.users) {
			return record;
		}
		return acc;
	});
}

type SubredditHeatmapRecord = {
	users: number;
	interval: number;
	date: Date;
};

export const aggregateRecordsToHourlyData = (
	records: WeeklySubredditRecords
): WeeklyRecordsByHour => {
	let maxUsers = 0;
	let dailyRecordsByHour: DayRecordByHour[] = [];

	records.forEach((dailyRecords) => {
		const dailyRecordByHour: DayRecordByHour = {
			day: new Date(dailyRecords[35]?.timestamp)?.getUTCDay(),
			records: []
		};

		for (let i = 0; i < dailyRecords.length; i += 3) {
			const hour = Math.floor(dailyRecords[i + 2].interval / INTERVALS_IN_HOUR);
			let i1 = dailyRecords[i]?.users || 0;
			let i2 = dailyRecords[i + 1]?.users || 0;
			let i3 = dailyRecords[i + 2]?.users || 0;

			let avg = Math.ceil((i1 + i2 + i3) / 3);
			let max = Math.max(i1, i2, i3);

			maxUsers = Math.max(max, maxUsers);

			dailyRecordByHour.records.push({ hour, users: avg });
		}

		dailyRecordsByHour.push(dailyRecordByHour);
	});
	return {
		maxUsers,
		dailyRecordsByHour
	};
};

export type DailyBestTime = {
	hour: number;
	users: number;
} | null;

type DailyBestReport = {
	day: number;
	peakHour: number;
	peakUsers: number;
};

type WeeklyBestTimes = {
	topWeekDays: DailyBestReport[];
	topDays: number[];
	maxUsers: number;
};
