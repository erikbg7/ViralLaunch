import { db } from '$lib/server/db';
import { session, user, type User } from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import {
	encodeBase32LowerCase,
	encodeBase64url,
	encodeHexLowerCase
} from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { eq, getTableColumns } from 'drizzle-orm';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const sessionCookieName = 'auth-session';

export class AuthRepository {
	static generateUserId() {
		// ID with 120 bits of entropy, or about the same as UUID v4.
		const bytes = crypto.getRandomValues(new Uint8Array(15));
		const id = encodeBase32LowerCase(bytes);
		return id;
	}

	static generateSessionToken() {
		const bytes = crypto.getRandomValues(new Uint8Array(18));
		const token = encodeBase64url(bytes);
		return token;
	}

	static deleteCookie(event: RequestEvent) {
		event.cookies.delete(sessionCookieName, {
			path: '/'
		});
	}

	static async invalidateSession(sessionId: string) {
		await db.delete(session).where(eq(session.id, sessionId));
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

	static async createSession(token: string, user: User) {
		const sessionId = encodeHexLowerCase(
			sha256(new TextEncoder().encode(token))
		);
		const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);

		const [newSession] = await db
			.insert(session)
			.values({ id: sessionId, userId: user.id, expiresAt })
			.returning(getTableColumns(session))
			.execute();

		return newSession;
	}

	static async validateSessionToken(token: string) {
		const sessionId = encodeHexLowerCase(
			sha256(new TextEncoder().encode(token))
		);
		const [result] = await db
			.select({
				// Adjust user table here to tweak returned data
				user: {
					id: user.id,
					username: user.username
				},
				session: session
			})
			.from(session)
			.innerJoin(user, eq(session.userId, user.id))
			.where(eq(session.id, sessionId));

		if (!result) {
			return { session: null, user: null };
		}
		const { session: userSession, user: userData } = result;

		const sessionExpired = Date.now() >= userSession.expiresAt.getTime();
		if (sessionExpired) {
			await db.delete(session).where(eq(session.id, userSession.id));
			return { session: null, user: null };
		}

		const renewSession =
			Date.now() >= userSession.expiresAt.getTime() - DAY_IN_MS * 15;
		if (renewSession) {
			userSession.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
			await db
				.update(session)
				.set({ expiresAt: userSession.expiresAt })
				.where(eq(session.id, userSession.id));
		}

		return { session: userSession, user: userData };
	}
}

export type SessionValidationResult = Awaited<
	ReturnType<typeof AuthRepository.validateSessionToken>
>;
