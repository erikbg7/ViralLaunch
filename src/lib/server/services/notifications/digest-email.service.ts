import { PreferencesRepository } from '$lib/server/repositories/preferences.repository';
import { UserRepository } from '$lib/server/repositories/user.repository';
import { AnalyticsService } from '$lib/server/services/analytics.service';
import { FollowService } from '$lib/server/services/follow.service';

export class DigestEmailService {
	static async sendWeeklyDigestEmail(userId: string) {
		// Fetch the user's preferences
		const preferences = await PreferencesRepository.getbyUserId(userId);
		const user = await UserRepository.get(userId);

		// Check if the user has opted in for weekly digest emails
		if (!preferences.weeklyDigest) {
			return;
		}

		// Fetch the user's followed subreddits
		const followedSubreddits =
			await FollowService.getFollowedSubreddits(userId);

		// Fetch the latest posts from the followed subreddits
		const weeklyAnalytics = followedSubreddits.map((subreddit) => {
			return AnalyticsService.getWeeklyAnalytics(subreddit.id);
		});

		// Format the data into an email-friendly report.
		// TODO
		const formattedReport = {};

		// Send the email using a mail service
		await MailService.sendDigestEmail(user.email, formattedReport);
	}

	static async sendDailyDigestEmail(userId: string) {}
}
