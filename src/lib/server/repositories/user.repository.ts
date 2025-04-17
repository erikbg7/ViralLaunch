import { and, eq, getTableColumns } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { hash, verify } from '@node-rs/argon2';
import { user, userUpdateSchema, type User } from '$lib/server/db/schema';

export class UserRepository {
	static generateId() {
		// ID with 120 bits of entropy, or about the same as UUID v4.
		const bytes = crypto.getRandomValues(new Uint8Array(15));
		const id = encodeBase32LowerCase(bytes);
		return id;
	}

	static async generatePasswordHash(password: string) {
		// recommended minimum parameters
		return await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
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
		id: User['id'],
		username: string,
		passwordHash: string,
		email?: string,
		googleId?: string,
		avatar?: string
	) {
		const [newUser] = await db
			.insert(user)
			.values({
				id,
				email,
				username,
				passwordHash,
				googleId,
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

	static verifyPassword(
		password: string,
		passwordHash: string
	): Promise<boolean> {
		return verify(passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
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
