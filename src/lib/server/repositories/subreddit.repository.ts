import { and, eq, getTableColumns } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	subreddit,
	subredditUrlInsertSchema,
	userSubreddits,
	type Subreddit,
	type UserSubreddits
} from '$lib/server/db/schema';

export class SubredditRepository {
	static async getAll() {
		return await db.select().from(subreddit);
	}

	static async create(url: string, name: string) {
		const result = await db
			.insert(subreddit)
			.values({ url, name })
			.returning(getTableColumns(subreddit));

		return result.at(0);
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

	static async createForUser(
		userId: UserSubreddits['userId'],
		subredditId: UserSubreddits['subredditId']
	) {
		return await db
			.insert(userSubreddits)
			.values({ userId, subredditId })
			.onConflictDoNothing();
	}

	static async deleteFromUser(
		userId: UserSubreddits['userId'],
		subredditId: UserSubreddits['subredditId']
	) {
		return await db
			.delete(userSubreddits)
			.where(
				and(
					eq(userSubreddits.userId, userId),
					eq(userSubreddits.subredditId, subredditId)
				)
			);
	}

	static async parse(subreddit: string) {
		try {
			const subredditUrl = subredditUrlInsertSchema.parse(subreddit);
			return {
				url: subredditUrl,
				name: subreddit.match(/reddit\.com\/r\/([^\/]+)/)?.[1]
			};
		} catch (e) {
			return {
				name: subreddit,
				url: `https://www.reddit.com/r/${subreddit}`
			};
		}
	}
}
