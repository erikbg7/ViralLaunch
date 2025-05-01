import { z } from 'zod';

import { adminProcedure, router } from '$lib/server/trpc/trpc';
import { RedditService } from '$lib/server/services/reddit.service';
import { RecordRepository } from '$lib/server/repositories/record.repository';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository';
import { MailService } from '$lib/server/services/mail.service';
import { mapRecords } from '$lib/stores/subreddit-data.svelte';
import type { DailyReportProps } from '$lib/emails/daily-report.svelte';

export const cronRouter = router({
	sendDailyDigestEmail: adminProcedure
		.input(z.object({ email: z.string() }))
		.mutation(async ({ input }) => {
			const records = await RecordRepository.getAllRecords('sveltejs');
			const bestTodayTimes = mapRecords(records).bestTodayTimes;

			const props: DailyReportProps = { bestTimes: bestTodayTimes };
			const htmlReport = await MailService.buildHtml('daily-report', props);

			await MailService.sendTestEmail(input.email, htmlReport);
			return 'ok';
		}),
	getSubreddits: adminProcedure.query(async () => {
		return SubredditRepository.getAll();
	}),
	createRecord: adminProcedure
		.input(
			z.object({
				id: z.string(),
				interval: z.number(),
				date: z.string()
			})
		)
		.mutation(async ({ input }) => {
			try {
				// console.log('[TRPC]', input.name, input.interval, input.date);
				const redditService = new RedditService();
				const users = await redditService.getOnlineUsers(input.id);
				console.log('[TRPC] ', input.id, ' - ', users);
				await RecordRepository.createRecord(
					input.id,
					users,
					input.interval,
					input.date
				);
			} catch (e) {
				console.error(
					'[TRPC] Error while getting online users for subreddit',
					e
				);
				// Send mail to admin saying that we could not retreive information for this subreddit
			}
		})
});
