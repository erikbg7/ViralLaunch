import { db } from '$lib/server/db';
import { eq, getTableColumns } from 'drizzle-orm';
import {
	session,
	user,
	type SessionInsert,
	type SessionUpdate
} from '$lib/server/db/schema';

export class SessionRepository {
	static async delete(id: string) {
		await db.delete(session).where(eq(session.id, id));
	}

	static async getWithUser(id: string) {
		const [sessionAndUser] = await db
			.select({
				// Adjust user table here to tweak returned data
				user: {
					id: user.id,
					email: user.email
				},
				session: session
			})
			.from(session)
			.innerJoin(user, eq(session.userId, user.id))
			.where(eq(session.id, id));

		return sessionAndUser;
	}

	static async create(newSession: SessionInsert) {
		const [createdSession] = await db
			.insert(session)
			.values(newSession)
			.returning(getTableColumns(session))
			.execute();

		return createdSession;
	}

	static async update(id: string, updateWith: SessionUpdate) {
		const [updatedSession] = await db
			.update(session)
			.set(updateWith)
			.where(eq(session.id, id));
		return updatedSession;
	}
}
