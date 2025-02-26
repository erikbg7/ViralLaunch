import { redirect } from '@sveltejs/kit';

export async function load(event) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, '/login');
	}

	return {
		user: event.locals.user
	};
}
