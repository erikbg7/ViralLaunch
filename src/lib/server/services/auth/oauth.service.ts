import {
	Google,
	decodeIdToken,
	generateCodeVerifier,
	generateState,
	type OAuth2Tokens
} from 'arctic';
import {
	GOOGLE_CALLBACK_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';

import type { User } from '$lib/server/db/schema';
import { UserRepository } from '$lib/server/repositories/user.repository';
import { AuthService } from '$lib/server/services/auth/auth.service';
import { SessionService } from '$lib/server/services/auth/session.service';
import { PreferencesRepository } from '$lib/server/repositories/preferences.repository';

const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URL
);

export class OAuthService {
	static async loginWithGoogle(event: RequestEvent) {
		const state = generateState();
		const scope = ['openid', 'profile', 'email'];
		const verifier = generateCodeVerifier();
		const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

		SessionService.setCookie(event, state, expiresAt, 'google_oauth_state');
		SessionService.setCookie(
			event,
			verifier,
			expiresAt,
			'google_code_verifier'
		);

		return google.createAuthorizationURL(state, verifier, scope);
	}

	static async validateGoogleOAuthResult(
		code: string | null,
		state: string | null,
		storedState: string | null,
		codeVerifier: string | null
	): Promise<{
		googleUserId: string;
		username: string;
		avatar: string;
		email: string;
	}> {
		if (
			code === null ||
			state === null ||
			storedState === null ||
			codeVerifier === null
		) {
			throw new Error('[OAuth] Missing code, state or verifier');
		}

		if (state !== storedState) {
			throw new Error('[OAuth] Invalid state');
		}

		let tokens: OAuth2Tokens = await google.validateAuthorizationCode(
			code,
			codeVerifier
		);

		const claims = decodeIdToken(tokens.idToken()) as Record<string, string>;

		return {
			googleUserId: claims.sub,
			username: claims.name,
			avatar: claims.picture,
			email: claims.email
		};
	}

	static async handleCallbackLogin(
		event: RequestEvent,
		googleId: string,
		username: string,
		avatar: string,
		email: string
	) {
		let user: User;

		const existingUser = await UserRepository.getFromGoogleId(googleId);

		// If the user already exists, we redirect them to the app
		if (existingUser) {
			user = existingUser;
		} else {
			const sameEmailUser = await UserRepository.get(email);

			// If a user with the same email already exists, we should not create a new user
			// but instead link the google account to the existing user
			if (sameEmailUser) {
				user = await UserRepository.update(sameEmailUser.id, {
					...sameEmailUser,
					googleId,
					username,
					avatar
				});
			} else {
				// If the user does not exist, we create a new user
				const id = AuthService.generateId();
				user = await UserRepository.create({
					id,
					googleId,
					username,
					email,
					avatar,
					passwordHash: null
				});
				await PreferencesRepository.create({ userId: user.id });
			}
		}

		const sessionToken = SessionService.generateSessionToken();
		const session = await SessionService.createSession(sessionToken, user.id);
		SessionService.setCookie(event, sessionToken, session.expiresAt);
	}
}
