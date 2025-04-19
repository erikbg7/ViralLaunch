import { type RequestEvent } from '@sveltejs/kit';
import { GoogleOAuth, type OAuth2Tokens } from '$lib/server/oauth';
import { AuthRepository } from '$lib/server/repositories/auth.repository';
import { UserRepository } from '$lib/server/repositories/user.repository';
import type { User } from '$lib/server/db/schema';

export class AuthService {
	static async logout(event: RequestEvent) {
		const sessionId = event.locals.session?.id;
		if (!sessionId) {
			return;
		}
		await AuthRepository.invalidateSession(sessionId);
		AuthRepository.deleteCookie(event);
	}

	static async register(
		event: RequestEvent,
		email: string | null,
		password: string | null
	) {
		if (email === null || password === null) {
			throw new Error('Email and password are required');
		}
		if (!UserRepository.validateEmail(email)) {
			throw new Error('Invalid email');
		}
		if (!UserRepository.validatePassword(password)) {
			throw new Error('Invalid password');
		}

		const existingUser = await UserRepository.get(email);
		if (existingUser) {
			throw new Error('User already exists');
		}

		const userId = UserRepository.generateId();
		const passwordHash = await UserRepository.generatePasswordHash(password);
		const user = await UserRepository.create({
			id: userId,
			email,
			passwordHash,
			username: null,
			googleId: null,
			avatar: null
		});
		const sessionToken = AuthRepository.generateSessionToken();
		const session = await AuthRepository.createSession(sessionToken, user);
		AuthRepository.setCookie(event, sessionToken, session.expiresAt);
	}

	static async login(
		event: RequestEvent,
		email: string | null,
		password: string | null
	) {
		if (email === null || password === null) {
			throw new Error('Email and password are required');
		}
		if (!UserRepository.validateEmail(email)) {
			throw new Error('Invalid email');
		}
		if (!UserRepository.validatePassword(password)) {
			throw new Error('Invalid password');
		}

		const existingUser = await UserRepository.get(email);
		if (!existingUser) {
			throw new Error('Incorrect email or password');
		}

		if (!existingUser.passwordHash) {
			throw new Error('Please login with Google');
		}

		const validPassword = await UserRepository.verifyPassword(
			password,
			existingUser.passwordHash
		);

		if (!validPassword) {
			throw new Error('Incorrect email or password');
		}

		const sessionToken = AuthRepository.generateSessionToken();
		const session = await AuthRepository.createSession(
			sessionToken,
			existingUser
		);
		AuthRepository.setCookie(event, sessionToken, session.expiresAt);
	}

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

		let tokens: OAuth2Tokens =
			await GoogleOAuth.client.validateAuthorizationCode(code, codeVerifier);

		const claims = GoogleOAuth.decodeIdToken(tokens.idToken()) as Record<
			string,
			string
		>;

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
				user = await UserRepository.create({
					id: UserRepository.generateId(),
					googleId,
					username,
					email,
					avatar,
					passwordHash: null
				});
			}
		}

		const sessionToken = AuthRepository.generateSessionToken();
		const session = await AuthRepository.createSession(sessionToken, user);
		AuthRepository.setCookie(event, sessionToken, session.expiresAt);
	}
}
