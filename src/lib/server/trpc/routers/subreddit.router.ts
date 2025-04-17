import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository';

export const subredditRouter = router({
	list: protectedProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				return SubredditRepository.getByWorkspaceId(
					ctx.user.id,
					parseInt(input.workspaceId)
				);
			} catch (error) {
				console.error('Error fetching subreddits:', error);
				throw new Error('Failed to fetch subreddits');
			}

			// return CenterService.getSubreddit(input.subreddit, ctx.user.id);
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
