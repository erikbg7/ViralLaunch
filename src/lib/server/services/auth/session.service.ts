import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { SessionRepository } from '$lib/server/repositories/session.repository';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const sessionCookieName = 'auth-session';
export type SessionValidationResult = Awaited<
	ReturnType<typeof SessionService.validateSessionToken>
>;

export class SessionService {
	static generateSessionToken() {
		const bytes = crypto.getRandomValues(new Uint8Array(18));
		const token = encodeBase64url(bytes);
		return token;
	}

	static async invalidateSession(sessionId: string) {
		await SessionRepository.delete(sessionId);
	}

	static async createSession(token: string, userId: string) {
		const sessionId = encodeHexLowerCase(
			sha256(new TextEncoder().encode(token))
		);
		const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);

		const newSession = await SessionRepository.create({
			id: sessionId,
			userId,
			expiresAt
		});

		return newSession;
	}

	static async validateSessionToken(token: string) {
		const sessionId = encodeHexLowerCase(
			sha256(new TextEncoder().encode(token))
		);
		const sessionData = await SessionRepository.getWithUser(sessionId);

		if (!sessionData) {
			return { session: null, user: null };
		}
		const { session: userSession, user: userData } = sessionData;

		const sessionExpired = Date.now() >= userSession.expiresAt.getTime();
		if (sessionExpired) {
			await SessionRepository.delete(userSession.id);
			return { session: null, user: null };
		}

		const renewSession =
			Date.now() >= userSession.expiresAt.getTime() - DAY_IN_MS * 15;
		if (renewSession) {
			userSession.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
			await SessionRepository.update(userSession.id, {
				expiresAt: userSession.expiresAt
			});
		}

		return { session: userSession, user: userData };
	}

	static deleteCookie(event: RequestEvent) {
		event.cookies.delete(sessionCookieName, {
			path: '/'
		});
	}

	static setCookie(
		event: RequestEvent,
		content: string,
		expiresAt: Date,
		name: string = sessionCookieName
	) {
		event.cookies.set(name, content, {
			httpOnly: true,
			sameSite: 'lax',
			secure: import.meta.env.PROD,
			expires: expiresAt,
			path: '/'
		});
	}
}
