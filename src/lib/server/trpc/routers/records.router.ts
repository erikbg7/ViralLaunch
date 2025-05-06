import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { RecordRepository } from '$lib/server/repositories/record.repository';

// this should be called analytics
export const recordsRouter = router({
	get: protectedProcedure
		.input(z.object({ subredditId: z.string() }))
		.query(async ({ input }) => {
			try {
				// return await RecordRepository.getAllRecords(input.subredditId);
				return await RecordRepository.getLastWeekRecords(input.subredditId);
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}
		}),
	getExact: protectedProcedure
		.input(z.object({ subredditId: z.string() }))
		.query(async ({ input }) => {
			try {
				const exact = await RecordRepository.getExactRecords(input.subredditId);
				return exact;
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}
		})
});
