import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { RecordRepository } from '$lib/server/repositories/record.repository';

export const recordsRouter = router({
	get: protectedProcedure
		.input(z.object({ workspaceId: z.string(), subredditId: z.number() }))
		.query(async ({ input }) => {
			try {
				return await RecordRepository.getAllRecords(input.subredditId);
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}
		})
});
