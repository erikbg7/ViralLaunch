import { db } from '$lib/server/db';
import { eq, getTableColumns, sql, desc, and, gte, asc } from 'drizzle-orm';
import { subredditRecord, type SubredditRecord } from '$lib/server/db/schema';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository';
import { floorTo20Minutes } from '$lib/timezone';

export class RecordRepository {
	static async getLastWeekRecords(subredditId: string) {
		const records = await db.execute<SubredditRecord>(sql`
			WITH cutoff AS (
  				SELECT now() AT TIME ZONE 'UTC' - INTERVAL '7 days' AS cutoff_ts
			),
			start_record AS (
				SELECT
					sr.timestamp AS start_ts
				FROM
					subreddit_record sr
					, cutoff c
				WHERE
					sr.timestamp > c.cutoff_ts
					AND sr.subreddit_id = ${subredditId}
				ORDER BY
					sr.timestamp
				LIMIT 1
			)
			SELECT sr.* FROM subreddit_record sr
			CROSS JOIN start_record s
			WHERE
				sr.timestamp >= s.start_ts
				AND sr.subreddit_id = ${subredditId}
			ORDER BY
				sr.timestamp;
		`);

		return records;
	}

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
