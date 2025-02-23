import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redditInsertSchema, redditRemoveSchema } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import {
	getProjectSubreddits,
	insertUserSubreddit,
	removeSubredditFromUser
} from '$lib/server/db/subreddit.model';

export const load: PageServerLoad = async (event) => {
	return {
		subreddits: await getProjectSubreddits(event.locals.user!.id, parseInt(event.params.id)),
		forms: {
			create_subreddit: await superValidate(zod(redditInsertSchema)),
			remove_subreddit: await superValidate(zod(redditRemoveSchema))
		}
	};
};

export const actions: Actions = {
	removeSubreddit: async (event) => {
		const userId = event.locals.user!.id;
		const productId = parseInt(event.params.id);

		const form = await superValidate(event, zod(redditRemoveSchema));

		if (!userId) {
			return redirect(302, '/demo/lucia/login');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const subredditId = form.data.id;

		await removeSubredditFromUser(userId, productId, subredditId);
	},
	createSubreddit: async (event) => {
		const userId = event.locals.user!.id;
		const productId = parseInt(event.params.id);

		const form = await superValidate(event, zod(redditInsertSchema));

		if (!userId) {
			return redirect(302, '/demo/lucia/login');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const subredditUrl = form.data.url;
		const subredditName = subredditUrl.match(/reddit\.com\/r\/([^\/]+)/)?.[1];

		if (!subredditName) {
			return fail(400, { form, error: 'Invalid subreddit URL' });
		}

		await insertUserSubreddit(productId, subredditUrl, subredditName);
	}
};
