import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getProductById } from '$lib/server/db/product.model';
import { createCustomPlatform, updatePlatformLaunch } from '$lib/server/db/platform.model';
import { fail, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { platformInsertSchema } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const product_id = parseInt(event.params.id);

	return {
		user: event.locals.user,
		launch: await getProductById(event.locals.user.id, product_id),
		form_create_platform: await superValidate(zod(platformInsertSchema))
	};
};

export const actions: Actions = {
	updateLaunched: async (event) => {
		const userId = event.locals.user!.id;
		const launchId = parseInt(event.params.id);

		const form = await event.request.formData();
		const platformId = parseInt(form.get('platformId') as string);
		const launched = form.get('launched') === 'true';

		if (!userId) {
			return redirect(302, '/login');
		}

		if (!launchId) {
			return redirect(302, '/login');
		}

		await updatePlatformLaunch(userId, launchId, platformId, launched);
	},
	createPlatform: async (event) => {
		const userId = event.locals.user!.id;
		const productId = parseInt(event.params.id);
		const form = await superValidate(event, zod(platformInsertSchema));

		if (!userId) {
			return redirect(302, '/login');
		}

		if (!productId) {
			return redirect(302, '/login');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		await createCustomPlatform(productId, form.data);
	}
};
