import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createTrpcCaller } from '$lib/server/trpc/caller';
import { tryCatch } from '$lib/try';
import { AuthService } from '$lib/server/services/auth/auth.service';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/app');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		const login = await tryCatch(
			AuthService.login(event, username as string, password as string)
		);
		if (login.error) {
			return fail(400, { message: login.error.message });
		}

		return redirect(302, '/app');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const register = await tryCatch(
			AuthService.register(event, email, password)
		);

		if (register.error) {
			return fail(400, { message: register.error.message });
		}

		return redirect(302, '/app');
	},
	logout: async (event) => {
		const api = await createTrpcCaller(event);
		await api.auth.logout();
		return redirect(302, '/login');
	}
};
