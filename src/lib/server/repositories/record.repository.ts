import { db } from '$lib/server/db';
import { eq, getTableColumns, sql, desc, and, gte, asc } from 'drizzle-orm';
import { subredditRecord, type SubredditRecord } from '$lib/server/db/schema';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository';
import { floorTo20Minutes } from '$lib/timezone';

export class RecordRepository {
	static async getAllRecords(subredditId: string) {
		const subreddit = await SubredditRepository.getById(subredditId);

		// const endDate = floorTo20Minutes(new Date());
		// const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		// console.log({ startDate });

		return await db
			.select({
				...getTableColumns(subredditRecord),
				timestamp: sql<string>`${subredditRecord.timestamp} AT TIME ZONE 'UTC'`
			})
			.from(subredditRecord)
			.where(and(eq(subredditRecord.subredditId, subreddit.id)))
			.orderBy(desc(subredditRecord.timestamp));
	}

	static async getExactRecords(subredditId: string) {}

	static async createRecord(
		subredditId: SubredditRecord['subredditId'],
		users: SubredditRecord['users'],
		interval: SubredditRecord['interval'],
		timestamp: SubredditRecord['timestamp']
	) {
		const [newRecord] = await db
			.insert(subredditRecord)
			.values({ subredditId, users, interval, timestamp })
			.returning(getTableColumns(subredditRecord));
		return newRecord;
	}
}
