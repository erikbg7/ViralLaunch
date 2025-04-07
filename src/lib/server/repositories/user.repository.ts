import { and, eq, getTableColumns } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user, USER_ROLES, userUpdateSchema } from '$lib/server/db/schema';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export class UserRepository {
	static generateId() {
		// ID with 120 bits of entropy, or about the same as UUID v4.
		const bytes = crypto.getRandomValues(new Uint8Array(15));
		const id = encodeBase32LowerCase(bytes);
		return id;
	}

	static async get(username: string) {
		const users = await db
			.select()
			.from(user)
			.where(eq(user.username, username))
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

	static async create(
		email?: string,
		username?: string,
		passwordHash?: string,
		googleId?: string,
		pinHash?: string,
		avatar?: string
	) {
		const id = UserRepository.generateId();
		const [newUser] = await db
			.insert(user)
			.values({
				id,
				role: USER_ROLES.USER,
				email,
				username,
				passwordHash,
				googleId,
				pinHash,
				avatar
			})
			.returning(getTableColumns(user))
			.execute();
		return newUser;
	}

	static async update(
		userId: string,
		data: Zod.infer<typeof userUpdateSchema>
	) {
		return await db
			.update(user)
			.set(data)
			.where(and(eq(user.id, userId)));
	}

	static async createGuest() {
		const id = UserRepository.generateId();
		const guest = await db
			.insert(user)
			.values({ id, role: USER_ROLES.GUEST })
			.returning(getTableColumns(user))
			.execute();
		return guest.at(0)!;
	}

	static validateUsername(username: unknown): username is string {
		return (
			typeof username === 'string' &&
			username.length >= 3 &&
			username.length <= 31 &&
			/^[a-z0-9_-]+$/.test(username)
		);
	}

	static validatePassword(password: unknown): password is string {
		return (
			typeof password === 'string' &&
			password.length >= 6 &&
			password.length <= 255
		);
	}
}
