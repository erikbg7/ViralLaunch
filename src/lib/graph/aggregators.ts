type HourlyData = {
	dayOfWeek: number;
	hourOfDay: number;
	avgUsers: number;
};

type DailyAverage = {
	dayOfWeek: number;
	avgUsers: number;
};

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

// async function getDailyGraphData(subredditId: number, weekStartDate: string) {
//     const hourlyData = await getHourlyGraphData(subredditId, weekStartDate);
//     return aggregateToDailyAverages(hourlyData);
//   }
