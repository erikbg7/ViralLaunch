import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { productInsertSchema } from '$lib/server/db/schema';
import {
	createProductWithDefaultPlatforms,
	deleteProduct,
	getUserProductsWithReddits
} from '$lib/server/db/product.model';

export const load: PageServerLoad = async (event) => {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, '/login');
	}

	return {
		products: await getUserProductsWithReddits(event.locals.user.id),
		form: await superValidate(zod(productInsertSchema))
	};
};

export const actions: Actions = {
	delete: async (event) => {
		const userId = event.locals.user?.id;
		const form = await event.request.formData();
		const productId = form.get('productId') as string;

		if (!userId) {
			return { success: false };
		}

		if (!productId) {
			return { success: false };
		}

		await deleteProduct(userId, parseInt(productId));

		return { success: true };
	},
	create: async (event) => {
		const form = await superValidate(event, zod(productInsertSchema));

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
			await createProductWithDefaultPlatforms(
				event.locals.user.id,
				form.data.name
			);
			return message(form, {
				status: 'success',
				text: 'launch created successfully'
			});
		} catch (e) {
			return message(form, {
				status: 'error',
				text: 'failed to create launch'
			});
		}
	}
};
