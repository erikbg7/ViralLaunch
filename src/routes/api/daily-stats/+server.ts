import { and, eq } from 'drizzle-orm';
import { getCurrentLastRecord } from '$lib/graph/aggregators.js';
import { db } from '$lib/server/db';
import { subredditHourlyAvg } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';

async function getHourlyGraphData(subredditId: number) {
	return await db
		.select({
			dayOfWeek: subredditHourlyAvg.dayOfWeek,
			hourOfDay: subredditHourlyAvg.hourOfDay,
			avgUsers: subredditHourlyAvg.avgOnlineUsers,
			lastRecord: subredditHourlyAvg.lastRecord,
			updatedAt: subredditHourlyAvg.updatedAt
		})
		.from(subredditHourlyAvg)
		.where(
			and(
				eq(subredditHourlyAvg.subredditId, subredditId)
				// eq(subredditHourlyAvg.weekStartDate, weekStartDate)
			)
		)
		.orderBy(subredditHourlyAvg.dayOfWeek, subredditHourlyAvg.hourOfDay);
}

export const GET = async (event) => {
	const url = new URL(event.request.url);
	const subredditId = url.searchParams.get('subredditId') as string;

	if (!subredditId) {
		return error(404, 'No subredditId provided');
	}

	const hourlyResults = await getHourlyGraphData(parseInt(subredditId));
	const currentHourlyRecord = getCurrentLastRecord(hourlyResults);

	return json({
		id: subredditId,
		lastRecord: currentHourlyRecord?.lastRecord,
		updatedAt: currentHourlyRecord?.updatedAt,
		results: hourlyResults
	});
};
