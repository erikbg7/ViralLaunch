import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository';

export const subredditRouter = router({
	list: protectedProcedure.query(async ({ ctx }) => {
		try {
			return SubredditRepository.getSubredditsByUserId(ctx.user.id);
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
		}),
	untrack: protectedProcedure
		.input(z.object({ subredditId: z.number() }))
		.mutation(({ ctx, input }) => {
			return SubredditRepository.deleteFromUser(ctx.user.id, input.subredditId);
		}),

	insert: protectedProcedure
		.input(z.object({ subreddit: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { url, name } = await SubredditRepository.parse(input.subreddit);

			if (!url || !name) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Invalid subreddit URL'
				});
			}

			const existingSubreddit = await SubredditRepository.getById(name);

			if (existingSubreddit) {
				await SubredditRepository.createForUser(
					ctx.user.id,
					existingSubreddit.id
				);
			} else {
				const newSubreddit = await SubredditRepository.create(url, name);
				await SubredditRepository.createForUser(ctx.user.id, newSubreddit!.id);
			}
		})
});
