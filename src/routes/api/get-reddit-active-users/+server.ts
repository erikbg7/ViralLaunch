import { json } from '@sveltejs/kit';
import { createTrpcCaller } from '$lib/server/trpc/caller.js';
import { floorTo20Minutes, getIntervalFromDate } from '$lib/timezone.js';

export const POST = async (event) => {
	console.log('[CRON] Webhook called');

	const api = await createTrpcCaller(event);
	const subreddits = await api.cron.getSubreddits();

	console.log('[CRON] Getting ', subreddits.length, ' subreddits');

	const date = new Date();
	const flooredDate = floorTo20Minutes(date);
	const interval = getIntervalFromDate(flooredDate);
	const flooredDateString = flooredDate.toISOString();

	subreddits.forEach((subreddit) => {
		const { id } = subreddit;
		console.log('[CRON] Getting online users for subreddit', id);

		api.cron.createRecord({
			id,
			interval,
			date: flooredDateString
		});
	});

	return json({ t: '[CRON] Information request end.' });
};
