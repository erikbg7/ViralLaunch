import { createTrpcCaller } from '$lib/server/trpc/caller';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	subredditInsertSchema,
	redditRemoveSchema
} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository';
import { tryCatch } from '$lib/try';

export const load: PageServerLoad = async (event) => {
	return {
		subreddits: await SubredditRepository.getSubredditsByUserId(
			event.locals.user!.id
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

		const form = await superValidate(event, zod(redditRemoveSchema));

		if (!userId) {
			return redirect(302, '/login');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const subredditId = form.data.id;

		const trpc = await createTrpcCaller(event);
		await trpc.subreddit.unfollow({ subredditId });

		return message(form, {
			status: 'success',
			text: 'subreddit removed successfully'
		});
	},
	createSubreddit: async (event) => {
		const userId = event.locals.user!.id;

		const form = await superValidate(event, zod(subredditInsertSchema));

		if (!userId) {
			return redirect(302, '/login');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const trpc = await createTrpcCaller(event);

		const insertion = await tryCatch(
			trpc.subreddit.follow({ subreddit: form.data.subreddit })
		);

		if (insertion.error) {
			console.error('Error inserting subreddit:', insertion.error);
			return fail(400, { form, error: 'Failed to insert subreddit' });
		}

		return message(form, {
			status: 'success',
			text: 'subreddit created successfully'
		});
	}
};
