import { subredditUrlInsertSchema } from '$lib/server/db/schema';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository';
import { TRPCError } from '@trpc/server';

export class FollowService {
	static async getFollowedSubreddits(userId: string) {
		try {
			return SubredditRepository.getSubredditsByUserId(userId);
		} catch (error) {
			console.error('Error fetching subreddits:', error);
			throw new Error('Failed to fetch subreddits');
		}
	}

	static async addFollowedSubreddit(userId: string, subredditName: string) {
		// 1. copy subreddit url
		// 2. send to api
		// 3. Make request to url to see if valid (200 back)
		// 4. If valid, extract title, then add to db
		// return CenterService.createSubreddit(input.name, ctx.user.id);
		const { url, name } = await this.parse(subredditName);

		if (!url || !name) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Invalid subreddit URL'
			});
		}

		const existingSubreddit = await SubredditRepository.getById(name);

		if (existingSubreddit) {
			await SubredditRepository.createForUser(userId, existingSubreddit.id);
			return existingSubreddit;
		} else {
			const newSubreddit = await SubredditRepository.create(url, name);
			await SubredditRepository.createForUser(userId, newSubreddit!.id);
			return newSubreddit;
		}
	}

	static async removeFollowedSubreddit(userId: string, subredditId: number) {
		try {
			SubredditRepository.deleteFromUser(userId, subredditId);
		} catch (e) {}
	}

	static async parse(subreddit: string) {
		try {
			const subredditUrl = subredditUrlInsertSchema.parse(subreddit);
			return {
				url: subredditUrl,
				name: subreddit.match(/reddit\.com\/r\/([^\/]+)/)?.[1]
			};
		} catch (e) {
			return {
				name: subreddit,
				url: `https://www.reddit.com/r/${subreddit}`
			};
		}
	}
}
