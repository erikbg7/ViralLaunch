type HourlyData = {
	dayOfWeek: number;
	hourOfDay: number;
	lastRecord: number;
	updatedAt: Date;
	avgUsers: number;
};

type DailyAverage = {
	dayOfWeek: number;
	avgUsers: number;
};

export function getDailyAverage(
	hourlyData: HourlyData[],
	dayOfWeek: HourlyData['dayOfWeek']
): HourlyData[] {
	return hourlyData.filter((d) => d.dayOfWeek === dayOfWeek);
}

export function aggregateToDailyAverages(hourlyData: HourlyData[]): DailyAverage[] {
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

export function getCurrentLastRecord(hourlyData: HourlyData[]): HourlyData | undefined {
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
