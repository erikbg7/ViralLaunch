import { db } from '$lib/server/db';
import { product, productSubreddit, subreddit, subredditHourlyAvg } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

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

	console.log({ result });

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
	let id;

	const [existingSubreddit] = await db.select().from(subreddit).where(eq(subreddit.name, name));

	if (!existingSubreddit) {
		const [newSubreddit] = await db
			.insert(subreddit)
			.values({ url, name })
			.returning({ id: subreddit.id });

		id = newSubreddit.id;
	} else {
		id = existingSubreddit.id;
	}
	await db.insert(productSubreddit).values({ productId, subredditId: id }).onConflictDoNothing();

	await db.insert(productSubreddit).values({ productId, subredditId: id }).onConflictDoNothing();
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
			weekStartDate
		}))
	);
}
export async function getHourlyGraphData(subredditId: number) {
	return await db
		.select({
			dayOfWeek: subredditHourlyAvg.dayOfWeek,
			hourOfDay: subredditHourlyAvg.hourOfDay,
			avgUsers: subredditHourlyAvg.avgOnlineUsers
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
