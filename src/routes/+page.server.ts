import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { launchInsertSchema } from '$lib/server/db/schema';
import { createLaunchWithDefaultPlatforms, getLaunchesByUserId } from '$lib/server/db/launch.model';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/demo/lucia/login');
	}
	return {
		user: event.locals.user,
		launches: getLaunchesByUserId(event.locals.user.id),
		form: await superValidate(zod(launchInsertSchema))
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(launchInsertSchema));

		if (!event.locals.user) {
			return fail(401, {
				form
			});
		}
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await createLaunchWithDefaultPlatforms(event.locals.user.id, form.data.name);
			return message(form, { status: 'success', text: 'launch created successfully' });
		} catch (e) {
			return message(form, { status: 'error', text: 'failed to create launch' });
		}
	}
};
