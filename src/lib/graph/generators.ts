function getStartOfLastWeek() {
	const now = new Date();
	const day = now.getUTCDay(); // 0 = Sunday
	const diffToMonday = (day === 0 ? -6 : 1) - day;
	const startOfThisWeek = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate() + diffToMonday,
			0,
			0,
			0,
			0
		)
	);
	startOfThisWeek.setUTCDate(startOfThisWeek.getUTCDate() - 7); // Go to last week's Monday
	return startOfThisWeek;
}

export function generateWeeklyFullFakeRecords() {
	const startOfLastWeek = getStartOfLastWeek();
	const result = [];

	for (let d = 0; d < 7; d++) {
		const currentDay = new Date(startOfLastWeek);
		currentDay.setUTCDate(startOfLastWeek.getUTCDate() + d);

		for (let interval = 0; interval < 72; interval++) {
			const timestamp = new Date(
				currentDay.getTime() + interval * 20 * 60 * 1000
			);
			result.push({
				timestamp: timestamp.toISOString(),
				users: (d + 1) * 100 + interval,
				interval
			});
		}
	}

	return result;
}
