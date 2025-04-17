import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	product,
	productSubreddit,
	subreddit,
	type Product,
	type Subreddit
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

	static async getByWorkspaceId(
		userId: Product['userId'],
		workspaceId: Product['id']
	) {
		const result = await db
			.select({
				subreddit: subreddit
			})
			.from(productSubreddit)
			.innerJoin(subreddit, eq(productSubreddit.subredditId, subreddit.id))
			.innerJoin(product, eq(productSubreddit.productId, workspaceId))
			.where(eq(product.userId, userId))
			.groupBy(subreddit.id);

		return result.map((row) => row.subreddit);
	}
}
