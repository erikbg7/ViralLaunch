import { db } from '$lib/server/db';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { subredditRecord, type SubredditRecord } from '$lib/server/db/schema';

export class RecordRepository {
	static async getAllRecords(subredditId: SubredditRecord['subredditId']) {
		return await db
			.select({
				...getTableColumns(subredditRecord),
				timestamp: sql<string>`${subredditRecord.timestamp} AT TIME ZONE 'UTC'`
			})
			.from(subredditRecord)
			.where(eq(subredditRecord.subredditId, subredditId));
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
