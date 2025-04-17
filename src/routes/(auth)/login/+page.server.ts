import { UserRepository } from '$lib/server/repositories/user.repository';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthRepository } from '$lib/server/repositories/auth.repository';
import { createTrpcCaller } from '$lib/server/trpc/caller';

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

		if (!UserRepository.validateUsername(username)) {
			return fail(400, {
				message:
					'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!UserRepository.validatePassword(password)) {
			return fail(400, {
				message: 'Invalid password (min 6, max 255 characters)'
			});
		}

		const existingUser = await UserRepository.get(username);

		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await UserRepository.verifyPassword(
			password,
			existingUser.passwordHash
		);

		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = AuthRepository.generateSessionToken();
		const session = await AuthRepository.createSession(
			sessionToken,
			existingUser
		);
		AuthRepository.setCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/app');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!UserRepository.validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!UserRepository.validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const userId = UserRepository.generateId();
		const passwordHash = await UserRepository.generatePasswordHash(password);

		try {
			const user = await UserRepository.create(userId, username, passwordHash);

			const sessionToken = AuthRepository.generateSessionToken();
			const session = await AuthRepository.createSession(sessionToken, user);
			AuthRepository.setCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/app');
	},
	logout: async (event) => {
		const api = await createTrpcCaller(event);
		await api.auth.logout();
		return redirect(302, '/login');
	}
};
