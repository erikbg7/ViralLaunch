import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { FollowService } from '$lib/server/services/follow.service';

export const subredditRouter = router({
	following: protectedProcedure.query(async ({ ctx }) => {
		return FollowService.getFollowedSubreddits(ctx.user.id);
	}),
	unfollow: protectedProcedure
		.input(z.object({ subredditId: z.number() }))
		.mutation(({ ctx, input }) => {
			return FollowService.removeFollowedSubreddit(
				ctx.user.id,
				input.subredditId
			);
		}),
	follow: protectedProcedure
		.input(z.object({ subreddit: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return FollowService.addFollowedSubreddit(ctx.user.id, input.subreddit);
		})
});
