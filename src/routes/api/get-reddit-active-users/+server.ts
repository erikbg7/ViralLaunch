import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { createProduct } from '$lib/server/db/product.model.js';
import { getAllSubreddits, insertHourlyAverage } from '$lib/server/db/subreddit.model.js';
import { RedditAPI } from '$lib/server/reddit-api.service';
import { json } from '@sveltejs/kit';

export const POST = async (event) => {
	console.log('[REDDIT API] Webhook called');

	return json('you have correclty called the endpoint');

	// await createProduct('5ykowyszumtyuqlrmplweodv', 'kakatu');

	const authHeader = event.request.headers.get('Authorization');
	if (!authHeader || authHeader !== `Bearer ${SUPABASE_SERVICE_KEY}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	console.log('[REDDIT API] Webhook call authorized');

	const subreddits = await getAllSubreddits();
	const dayOfWeek = ((new Date().getUTCDay() + 6) % 7) + 1;
	const hourOfDay = new Date().getUTCHours();

	await Promise.all(
		subreddits.map(async (subreddit) => {
			const { name, id } = subreddit;
			const redditApi = new RedditAPI();
			const onlineUsers = await redditApi.getSubredditOnlineUsers(name);
			await insertHourlyAverage(id, dayOfWeek, hourOfDay, onlineUsers);
		})
	);

	return json('you have correclty called the endpoint');
};
