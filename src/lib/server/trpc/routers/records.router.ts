import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { db } from '$lib/server/db';
import { subredditRecord } from '$lib/server/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';

export const recordsRouter = router({
	get: protectedProcedure
		.input(z.object({ workspaceId: z.string(), subredditId: z.number() }))
		.query(async ({ ctx, input }) => {
			try {
				const records = await db
					.select(getTableColumns(subredditRecord))
					.from(subredditRecord)
					.where(eq(subredditRecord.subredditId, input.subredditId));

				let recordsPerWeekDay: Array<any>[] = Array.from(
					{ length: 7 },
					() => []
				);

				records.forEach((record) => {
					const date = new Date(record.timestamp);
					const weekDay = date.getDay();
					const previousRecords = recordsPerWeekDay[weekDay] || [];
					previousRecords.push(record);

					recordsPerWeekDay[weekDay] = previousRecords;
				});

				return recordsPerWeekDay;
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}

			// return CenterService.getSubreddit(input.subreddit, ctx.user.id);
		})
});
