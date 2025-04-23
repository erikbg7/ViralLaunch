import { and, eq, getTableColumns } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	user,
	type User,
	type UserInsert,
	type UserUpdate
} from '$lib/server/db/schema';

export class UserRepository {
	static async get(email: User['email']) {
		const users = await db
			.select()
			.from(user)
			.where(eq(user.email, email))
			.limit(1);

		return users.at(0);
	}

	static async getFromGoogleId(googleId: string) {
		const users = await db
			.select()
			.from(user)
			.where(eq(user.googleId, googleId))
			.limit(1);

		return users.at(0);
	}

	static async create(newUser: UserInsert) {
		const [createdUser] = await db
			.insert(user)
			.values(newUser)
			.returning(getTableColumns(user))
			.execute();
		return createdUser;
	}

	static async update(id: string, updateWith: UserUpdate) {
		const [updateUser] = await db
			.update(user)
			.set(updateWith)
			.where(and(eq(user.id, id)))
			.returning(getTableColumns(user));
		return updateUser;
	}
}
