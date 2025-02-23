import { aggregateToDailyAverages, getCurrentLastRecord } from '$lib/graph/aggregators.js';
import { getHourlyGraphData } from '$lib/server/db/subreddit.model.js';
import { error, json } from '@sveltejs/kit';

export const GET = async (event) => {
	const url = new URL(event.request.url);
	const subredditId = url.searchParams.get('subredditId') as string;

	if (!subredditId) {
		return error(404, 'No subredditId provided');
	}

	const hourlyResults = await getHourlyGraphData(parseInt(subredditId));
	const weeklyResults = aggregateToDailyAverages(hourlyResults);
	const currentHourlyRecord = getCurrentLastRecord(hourlyResults);

	return json({
		id: subredditId,
		lastRecord: currentHourlyRecord?.lastRecord,
		updatedAt: currentHourlyRecord?.updatedAt,
		results: weeklyResults
	});
};
