import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import {
	getHourlyGraphData,
	getProjectSubreddits
} from '$lib/server/db/subreddit.model';
import { TRPCError } from '@trpc/server';
import { getCurrentLastRecord } from '$lib/graph/aggregators';
// import { centerFilterSchema, centerInsertSchema } from '$lib/server/db/schema';

export const subredditRouter = router({
	list: protectedProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const subreddits = await getProjectSubreddits(
					ctx.user.id,
					parseInt(input.workspaceId)
				);

				return subreddits;
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}

			// return CenterService.getSubreddit(input.subreddit, ctx.user.id);
		}),
	get: protectedProcedure
		.input(z.object({ subredditId: z.number() }))
		.query(async ({ ctx, input }) => {
			try {
				const subredditId = input.subredditId;

				if (!subredditId) {
					throw new TRPCError({
						message: 'A subreddit it is needed',
						code: 'INTERNAL_SERVER_ERROR'
					});
				}

				const hourlyResults = await getHourlyGraphData(subredditId);
				const currentHourlyRecord = getCurrentLastRecord(hourlyResults);

				return {
					id: subredditId,
					lastRecord: currentHourlyRecord?.lastRecord,
					updatedAt: currentHourlyRecord?.updatedAt,
					results: hourlyResults
				};
			} catch (error) {
				console.error('Error fetching subreddit:', error);
				throw new Error('Failed to fetch subreddit');
			}
		}),
	create: protectedProcedure
		.input(z.object({ url: z.string() }))
		.mutation(({ ctx, input }) => {
			// 1. copy subreddit url
			// 2. send to api
			// 3. Make request to url to see if valid (200 back)
			// 4. If valid, extract title, then add to db
			// return CenterService.createSubreddit(input.name, ctx.user.id);
		})

	// list: protectedProcedure
	// 	.input(centerFilterSchema.optional())
	// 	.query(({ ctx, input }) => {
	// 		return CenterService.searchCenters(ctx.user.id, input);
	// 	}),
	// get: protectedProcedure
	// 	.input(z.object({ centerId: z.number() }))
	// 	.query(({ ctx, input }) => {
	// 		return CenterService.getById(input.centerId, ctx.user.id);
	// 	}),
	// create: protectedProcedure
	// 	.input(centerInsertSchema.omit({ id: true, userId: true }))
	// 	.mutation(({ input, ctx }) => {
	// 		const grading = input.grading as Record<string, string>;
	// 		return CenterService.createCenter(input.name, grading, ctx.user.id);
	// 	})
});
