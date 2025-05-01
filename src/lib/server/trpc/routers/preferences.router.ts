import { z } from 'zod';
import {
	NotificationFrequency,
	TimeFormat,
	TimeZone,
	WeekDay,
	WeekStart
} from '$lib/constants';
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
	update: protectedProcedure
		.input(
			z.object({
				timezone: z.enum(Object.values(TimeZone) as [TimeZone, ...TimeZone[]]),
				timeformat: z.enum(
					Object.values(TimeFormat) as [TimeFormat, ...TimeFormat[]]
				),
				weekstart: z.enum(
					Object.values(WeekStart) as [WeekStart, ...WeekStart[]]
				),
				notificationDay: z.enum(
					Object.values(WeekDay) as [WeekDay, ...WeekDay[]]
				),
				notificationTime: z.string(),
				notificationEmail: z.string(),
				notificationFrequency: z.enum(
					Object.values(NotificationFrequency) as [
						NotificationFrequency,
						...NotificationFrequency[]
					]
				)
			})
		)
		.mutation(async ({ ctx, input }) => {
			return await PreferencesService.updateUserPreferences(
				ctx.user.id,
				input.timezone,
				input.timeformat,
				input.weekstart,
				input.notificationDay,
				input.notificationTime,
				input.notificationFrequency,
				input.notificationEmail
			);
		})
});
