import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	subredditInsertSchema,
	redditRemoveSchema
} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import {
	getProjectSubreddits,
	insertUserSubreddit,
	parseSubreddit,
	removeSubredditFromUser
} from '$lib/server/db/subreddit.model';

export const load: PageServerLoad = async (event) => {
	return {
		subreddits: await getProjectSubreddits(
			event.locals.user!.id,
			parseInt(event.params.id)
		),
		forms: {
			create_subreddit: await superValidate(zod(subredditInsertSchema)),
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
			return redirect(302, '/login');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const subredditId = form.data.id;

		await removeSubredditFromUser(userId, productId, subredditId);

		return message(form, {
			status: 'success',
			text: 'subreddit removed successfully'
		});
	},
	createSubreddit: async (event) => {
		const userId = event.locals.user!.id;
		const productId = parseInt(event.params.id);

		const form = await superValidate(event, zod(subredditInsertSchema));

		if (!userId) {
			return redirect(302, '/login');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const { url, name } = parseSubreddit(form.data.subreddit);

		if (!url || !name) {
			return fail(400, { form, error: 'Not a valid subreddit' });
		}

		try {
			await insertUserSubreddit(productId, url, name);
		} catch (e) {
			console.error({ e });
			return fail(500, { form, error: 'Failed to create subreddit' });
		}

		return message(form, {
			status: 'success',
			text: 'subreddit created successfully'
		});
	}
};
