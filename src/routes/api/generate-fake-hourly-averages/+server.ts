import { insertHourlyAverages } from '$lib/server/db/subreddit.model';
import { json } from '@sveltejs/kit';

export const POST = async (event) => {
	const { subredditId, weekStartDate } = await event.request.json();

	const data = Array.from({ length: 7 }, (_, dayOfWeek) =>
		Array.from({ length: 24 }, (_, hourOfDay) => ({
			dayOfWeek: dayOfWeek + 1,
			hourOfDay,
			avgUsers: Math.floor(Math.random() * 1000)
		}))
	).flat();

	await insertHourlyAverages(subredditId, weekStartDate, data);

	return json('ok');
};
