import type { RequestEvent } from '@sveltejs/kit';
import { GoogleOAuth } from '$lib/server/oauth';
import { AuthRepository } from '$lib/server/repositories/auth.repository';
import { UserRepository } from '$lib/server/repositories/user.repository';
import type { User } from '$lib/server/db/schema';

export class AuthService {
	static async logout(event: RequestEvent, user: User) {
		const cookieName = AuthRepository.getCookieNameByRole(user.role);
		if (cookieName === AuthRepository.USER_COOKIE) {
			await AuthRepository.invalidateSession(event.locals.session.id);
			AuthRepository.deleteCookie(event, cookieName);
		}
	}

	static async login(event: RequestEvent, email: string, password: string) {}

	static async loginAsGuest(event: RequestEvent) {
		const user = await UserRepository.createGuest();
		const token = AuthRepository.generateSessionToken();
		const session = await AuthRepository.createSession(token, user);
		const cookie = AuthRepository.GUEST_COOKIE;

		AuthRepository.setCookie(cookie, event, token, session.expiresAt);
	}

	static async loginWithGoogle(event: RequestEvent) {
		const state = GoogleOAuth.generateState();
		const scope = ['openid', 'profile', 'email'];
		const verifier = GoogleOAuth.generateCodeVerifier();
		const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

		AuthRepository.setCookie('google_oauth_state', event, state, expiresAt);
		AuthRepository.setCookie(
			'google_code_verifier',
			event,
			verifier,
			expiresAt
		);

		return GoogleOAuth.client.createAuthorizationURL(state, verifier, scope);
	}
}
