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
		})
});
