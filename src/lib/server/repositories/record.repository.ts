import { db } from '$lib/server/db';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { subredditRecord, type SubredditRecord } from '$lib/server/db/schema';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository';

export class RecordRepository {
	static async getAllRecords(subredditId: string) {
		const subreddit = await SubredditRepository.getById(subredditId);

		return await db
			.select({
				...getTableColumns(subredditRecord),
				timestamp: sql<string>`${subredditRecord.timestamp} AT TIME ZONE 'UTC'`
			})
			.from(subredditRecord)
			.where(eq(subredditRecord.subredditId, subreddit.id));
	}

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
