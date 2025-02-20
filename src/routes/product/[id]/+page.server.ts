import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getLaunchById } from '$lib/server/db/launch.model';
import { updatePlatformLaunched } from '$lib/server/db/platform.model';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/demo/lucia/login');
	}

	const product_id = parseInt(event.params.id);

	return {
		user: event.locals.user,
		launch: await getLaunchById(event.locals.user.id, product_id)
	};
	// form: await superValidate(zod(launchInsertSchema))
};

export const actions: Actions = {
	updateLaunched: async (event) => {
		const userId = event.locals.user!.id;
		const launchId = parseInt(event.params.id);

		const form = await event.request.formData();
		const platformId = parseInt(form.get('platformId') as string);
		const launched = form.get('launched') === 'true';

		if (!userId) {
			return redirect(302, '/demo/lucia/login');
		}

		if (!launchId) {
			return redirect(302, '/demo/lucia/login');
		}

		await updatePlatformLaunched(userId, launchId, platformId, launched);
	}
};
