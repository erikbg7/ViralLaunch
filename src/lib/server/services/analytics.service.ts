import { FollowService } from '$lib/server/services/follow.service';

export class AnalyticsService {
	static async getWeeklyAnalytics(userId: string) {
		const followedSubreddits =
			await FollowService.getFollowedSubreddits(userId);

		return 2;
		// TODO: implement the logic to fetch weekly analytics for a subreddit
	}

	// return best times for today based on the same day of last week, for all subreddits that the user is following

	static async getUserDailyDigest(userId: string) {
		const followedSubreddits =
			await FollowService.getFollowedSubreddits(userId);

		return 2;
	}
}
