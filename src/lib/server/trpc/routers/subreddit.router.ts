import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { FollowService } from '$lib/server/services/follow.service';
import { RecordRepository } from '$lib/server/repositories/record.repository';
import { migrate } from '$lib/server/db/migrate';

export const subredditRouter = router({
	list: protectedProcedure.query(async () => {
		return FollowService.getAllSubreddits();
	}),
	following: protectedProcedure.query(async ({ ctx }) => {
		return FollowService.getFollowedSubreddits(ctx.user.id);
	}),
	unfollow: protectedProcedure
		.input(z.object({ subredditId: z.string() }))
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
		}),
	migrate: protectedProcedure.mutation(async ({ ctx, input }) => {
		await migrate();
	})
});
