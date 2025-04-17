import { db } from '$lib/server/db';
import {
	product,
	productSubreddit,
	subreddit,
	subredditHourlyAvg,
	subredditUrlInsertSchema
} from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function insertUserSubreddit(
	productId: number,
	url: string,
	name: string
): Promise<any> {
	const [existingSubreddit] = await db
		.select()
		.from(subreddit)
		.where(eq(subreddit.name, name));

	if (existingSubreddit) {
		await db
			.insert(productSubreddit)
			.values({ productId, subredditId: existingSubreddit.id })
			.onConflictDoNothing();
	} else {
		const [newSubreddit] = await db
			.insert(subreddit)
			.values({ url, name })
			.returning({ id: subreddit.id });

		await db
			.insert(productSubreddit)
			.values({ productId, subredditId: newSubreddit.id });
		// .onConflictDoNothing();
	}
}

export async function removeSubreddit(subredditId: number) {
	return await db.transaction(async (tx) => {
		await tx.delete(subreddit).where(eq(subreddit.id, subredditId));
	});
}

export async function removeSubredditFromUser(
	userId: string,
	productId: number,
	subredditId: number
) {
	return await db.transaction(async (tx) => {
		const [userProduct] = await tx
			.select()
			.from(product)
			.where(and(eq(product.id, productId), eq(product.userId, userId)));

		if (!userProduct) {
			throw new Error('Product not found');
		}

		return await tx
			.delete(productSubreddit)
			.where(
				and(
					eq(productSubreddit.productId, productId),
					eq(productSubreddit.productId, productId),
					eq(productSubreddit.subredditId, subredditId)
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
