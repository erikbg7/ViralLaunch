import { db } from '$lib/server/db';
import {
	product,
	productSubreddit,
	subreddit,
	subredditHourlyAvg,
	subredditUrlInsertSchema
} from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function getAllSubreddits() {
	return await db.select().from(subreddit);
}

export async function getProjectSubreddits(userId: string, productId: number) {
	const result = await db
		.select({
			subreddit: subreddit
		})
		.from(productSubreddit)
		.innerJoin(subreddit, eq(productSubreddit.subredditId, subreddit.id))
		.innerJoin(product, eq(productSubreddit.productId, productId))
		.where(eq(product.userId, userId))
		.groupBy(subreddit.id);

	return result.map((row) => row.subreddit);

	// const subreddits = await db
	// 	.select({ subreddit: subreddit })
	// 	.from(subreddit)
	// 	.leftJoin(
	// 		productSubreddit,
	// 		and(eq(productSubreddit.subredditId, subreddit.id), eq(productSubreddit.productId, productId))
	// 	)
	// 	.where(eq(productSubreddit.productId, productId));

	// return subreddits.map((row) => row.subreddit);
}

export async function insertUserSubreddit(
	productId: number,
	url: string,
	name: string
): Promise<any> {
	const [existingSubreddit] = await db.select().from(subreddit).where(eq(subreddit.name, name));

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

		await db.insert(productSubreddit).values({ productId, subredditId: newSubreddit.id });
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

export async function insertHourlyAverages(
	subredditId: number,
	weekStartDate: string,
	data: { dayOfWeek: number; hourOfDay: number; avgUsers: number }[]
) {
	await db.insert(subredditHourlyAvg).values(
		data.map(({ dayOfWeek, hourOfDay, avgUsers }) => ({
			subredditId,
			dayOfWeek,
			hourOfDay,
			avgOnlineUsers: avgUsers,
			lastRecord: avgUsers,
			weekStartDate
		}))
	);
}

export async function insertHourlyAverage(
	subredditId: number,
	dayOfWeek: number,
	hourOfDay: number,
	newOnlineUsers: number
) {
	// Fetch the previous record for this subreddit, day, hour, and week
	const previousRecord = await db
		.select()
		.from(subredditHourlyAvg)
		.where(
			and(
				eq(subredditHourlyAvg.subredditId, subredditId),
				eq(subredditHourlyAvg.dayOfWeek, dayOfWeek),
				eq(subredditHourlyAvg.hourOfDay, hourOfDay)
			)
		)
		.limit(1);

	if (previousRecord.length > 0) {
		// If a previous record exists, calculate new average
		const prevAvg = previousRecord[0].avgOnlineUsers || newOnlineUsers;
		const newAvg = Math.ceil((prevAvg * 5 + newOnlineUsers) / 6);

		// Update existing record
		await db
			.update(subredditHourlyAvg)
			.set({ avgOnlineUsers: newAvg, lastRecord: newOnlineUsers })
			.where(eq(subredditHourlyAvg.id, previousRecord[0].id));
	} else {
		// Insert new record
		await db.insert(subredditHourlyAvg).values({
			subredditId,
			dayOfWeek,
			hourOfDay,
			avgOnlineUsers: newOnlineUsers,
			lastRecord: newOnlineUsers,
			weekStartDate: '1997-03-01'
		});
	}
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
