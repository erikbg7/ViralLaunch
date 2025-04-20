import { db } from '$lib/server/db';
import {
	subreddit,
	subredditHourlyAvg,
	subredditUrlInsertSchema,
	userSubreddits
} from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function insertUserSubreddit(
	url: string,
	name: string
): Promise<any> {
	// const [existingSubreddit] = await db
	// 	.select()
	// 	.from(subreddit)
	// 	.where(eq(subreddit.name, name));
	// if (existingSubreddit) {
	// 	await db
	// 		.insert(productSubreddit)
	// 		.values({ productId, subredditId: existingSubreddit.id })
	// 		.onConflictDoNothing();
	// } else {
	// 	const [newSubreddit] = await db
	// 		.insert(subreddit)
	// 		.values({ url, name })
	// 		.returning({ id: subreddit.id });
	// 	await db
	// 		.insert(productSubreddit)
	// 		.values({ productId, subredditId: newSubreddit.id });
	// 	// .onConflictDoNothing();
	// }
}

export async function removeSubreddit(subredditId: number) {
	return await db.transaction(async (tx) => {
		await tx.delete(subreddit).where(eq(subreddit.id, subredditId));
	});
}

export async function removeSubredditFromUser(
	userId: string,
	subredditId: number
) {
	return await db.transaction(async (tx) => {
		const [userSubreddit] = await tx
			.select()
			.from(userSubreddits)
			.where(
				and(
					eq(userSubreddits.subredditId, subredditId),
					eq(userSubreddits.userId, userId)
				)
			);

		if (!userSubreddit) {
			throw new Error('Your cannot untrack a subreddit you are not following.');
		}

		return await tx
			.delete(userSubreddits)
			.where(
				and(
					eq(userSubreddits.userId, userId),
					eq(userSubreddits.subredditId, subredditId)
				)
			);
	});
}

export async function getHourlyGraphData(subredditId: number) {
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

export function parseSubreddit(subreddit: string) {
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
