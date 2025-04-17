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
					.select({
						...getTableColumns(subredditRecord),
						timestamp: sql<string>`${subredditRecord.timestamp} AT TIME ZONE 'UTC'`
					})
					.from(subredditRecord)
					.where(eq(subredditRecord.subredditId, input.subredditId));

				return records;
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}
		})
});
