import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	subreddit,
	userSubreddits,
	type Subreddit,
	type UserSubreddits
} from '$lib/server/db/schema';

export class SubredditRepository {
	static async getAll() {
		return await db.select().from(subreddit);
	}

	static async getById(name: Subreddit['name']) {
		const result = await db
			.select()
			.from(subreddit)
			.where(eq(subreddit.name, name));
		return result.at(0);
	}

	static async getSubredditsByUserId(userId: UserSubreddits['userId']) {
		const result = await db
			.select({
				subreddit: subreddit
			})
			.from(userSubreddits)
			.innerJoin(subreddit, eq(userSubreddits.subredditId, subreddit.id))
			.where(eq(userSubreddits.userId, userId))
			.groupBy(subreddit.id);

		return result.map((row) => row.subreddit);
	}
}
