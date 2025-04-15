import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { db } from '$lib/server/db';
import { subredditRecord } from '$lib/server/db/schema';
import { eq, getTableColumns, sql } from 'drizzle-orm';

export const recordsRouter = router({
	get: protectedProcedure
		.input(z.object({ workspaceId: z.string(), subredditId: z.number() }))
		.query(async ({ ctx, input }) => {
			try {
				const records = await db
					.select(getTableColumns(subredditRecord))
					.from(subredditRecord)
					.where(eq(subredditRecord.subredditId, input.subredditId));

				const groupedByUtcDay = Array.from({ length: 7 }, () => [] as any[]);

				for (const record of records) {
					const utcDay = new Date(`${record.timestamp}Z`).getUTCDay(); // 0 = Sunday
					groupedByUtcDay[utcDay].push(record);
				}

				return groupedByUtcDay;
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}
		}),
	get2: protectedProcedure
		.input(z.object({ workspaceId: z.string(), subredditId: z.number() }))
		.query(async ({ ctx, input }) => {
			try {
				// const rows = await db
				// 	.select({
				// 		users: subredditRecord.users,
				// 		timestamp: subredditRecord.timestamp,
				// 		maxUsers: sql`MAX(${subredditRecord.users}) OVER ()`
				// 	})
				// 	.from(subredditRecord)
				// 	.where(eq(subredditRecord.subredditId, input.subredditId));

				// console.log({ rows });

				const records = await db
					.select({
						...getTableColumns(subredditRecord),
						timestamp: sql<string>`${subredditRecord.timestamp} AT TIME ZONE 'UTC'`
						// interval: subredditRecord.interval,
						// users: subredditRecord.users,
						// timestamp: subredditRecord.timestamp,
					})
					.from(subredditRecord)
					.where(eq(subredditRecord.subredditId, input.subredditId));

				return records;

				// const groupedByUtcDay: WeeklySubredditRecords = Array.from(
				// 	{ length: 7 },
				// 	() => []
				// );

				// for (const record of records) {
				// 	const utcDay = new Date(`${record.timestamp}Z`).getUTCDay(); // 0 = Sunday
				// 	groupedByUtcDay[utcDay].push(record);
				// }

				// return groupedByUtcDay;
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}
		})
});
