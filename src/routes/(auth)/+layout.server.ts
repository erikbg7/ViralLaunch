import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export async function load(event): LayoutServerLoad {
	if (event.locals.session !== null && event.locals.user !== null) {
		throw redirect(303, '/app');
	}
}
