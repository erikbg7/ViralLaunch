import { z } from 'zod';
import { TimeZone } from '$lib/constants';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { PreferencesService } from '$lib/server/services/preferences.service';

export const preferencesRouter = router({
	get: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await PreferencesService.getUserPreferences(ctx.user.id);
		} catch (error) {
			console.error('Error fetching subreddits:', error);
			throw new Error('Failed to fetch subreddits');
		}
	}),
	updateTimezone: protectedProcedure
		.input(
			z.object({
				timezone: z.enum(Object.values(TimeZone) as [string, ...string[]])
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				return await PreferencesService.updateTimezone(
					ctx.user.id,
					input.timezone as TimeZone
				);
			} catch (error) {
				console.error('Error updating timezone:', error);
				throw new Error('Failed to update timezone');
			}
		})
});
