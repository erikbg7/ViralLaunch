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
