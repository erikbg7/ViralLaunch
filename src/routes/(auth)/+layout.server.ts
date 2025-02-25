import { redirect } from '@sveltejs/kit';

export async function load(event): PageServerLoad {
	if (event.locals.session !== null && event.locals.user !== null) {
		throw redirect(303, '/app');
	}
}
