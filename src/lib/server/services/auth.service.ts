import type { RequestEvent } from '@sveltejs/kit';
import { GoogleOAuth } from '$lib/server/oauth';
import { AuthRepository } from '$lib/server/repositories/auth.repository';
import { UserRepository } from '$lib/server/repositories/user.repository';

export class AuthService {
	static async logout(event: RequestEvent) {
		const sessionId = event.locals.session?.id;
		if (!sessionId) {
			return;
		}
		await AuthRepository.invalidateSession(sessionId);
		AuthRepository.deleteCookie(event);
	}

	static async register(event: RequestEvent, email: string, password: string) {
		// const existingUser = await UserRepository.get(email);
		// if (existingUser) {
		// 	return { error: 'User already exists' };
		// }
		// const passwordHash = await UserRepository.hashPassword(password);
		// const user = await UserRepository.create(email, passwordHash);
		// const token = AuthRepository.generateSessionToken();
		// const session = await AuthRepository.createSession(token, user);
		// AuthRepository.setCookie(cookie, event, token, session.expiresAt);
	}

	static async login(event: RequestEvent, email: string, password: string) {}

	static async loginWithGoogle(event: RequestEvent) {
		const state = GoogleOAuth.generateState();
		const scope = ['openid', 'profile', 'email'];
		const verifier = GoogleOAuth.generateCodeVerifier();
		const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

		AuthRepository.setCookie(event, state, expiresAt, 'google_oauth_state');
		AuthRepository.setCookie(
			event,
			verifier,
			expiresAt,
			'google_code_verifier'
		);

		return GoogleOAuth.client.createAuthorizationURL(state, verifier, scope);
	}
}
