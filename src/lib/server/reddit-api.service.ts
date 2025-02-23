import {
    REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET,
    REDDIT_PASSWORD,
    REDDIT_USER_AGENT,
    REDDIT_USERNAME,
} from "$env/static/private";
import Snoowrap from "snoowrap";

export class RedditAPI {
    private reddit: Snoowrap;

    constructor() {
        this.reddit = new Snoowrap({
            userAgent: REDDIT_USER_AGENT,
            clientId: REDDIT_CLIENT_ID,
            clientSecret: REDDIT_CLIENT_SECRET,
            username: REDDIT_USERNAME,
            password: REDDIT_PASSWORD,
        });
    }

    async getSubredditOnlineUsers(subredditId: string) {
        const subreddit = this.reddit.getSubreddit(subredditId);
        return subreddit.active_user_count;
    }
}
