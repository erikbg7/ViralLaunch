import { and, eq, getTableColumns } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { hash, verify } from '@node-rs/argon2';
import { user, type User } from '$lib/server/db/schema';

interface EmailValidationResult {
	valid: boolean;
	error?: string;
}

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

	static async create({
		id,
		email,
		passwordHash,
		username,
		googleId,
		avatar
	}: Omit<User, 'createdAt'>) {
		const [newUser] = await db
			.insert(user)
			.values({
				id,
				email,
				passwordHash,
				username,
				googleId,
				avatar
			})
			.returning(getTableColumns(user))
			.execute();
		return newUser;
	}

	static async update(userId: string, data: User) {
		const [updateUser] = await db
			.update(user)
			.set(data)
			.where(and(eq(user.id, userId)))
			.returning(getTableColumns(user));
		return updateUser;
	}

	static verifyPassword(
		password: string,
		passwordHash: string | undefined
	): Promise<boolean> {
		if (!passwordHash) {
			return Promise.resolve(false);
		}
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

	static validateEmail(email: string): EmailValidationResult {
		// 1. Trim whitespace
		const trimmed = email.trim();

		// 2. Presence check
		if (trimmed.length === 0) {
			return { valid: false, error: 'Email is required.' };
		}

		// 3. Overall maximum length
		if (trimmed.length > 254) {
			return {
				valid: false,
				error: 'Email must be 254 characters or fewer.'
			};
		}

		// 4. Basic format via regex (local@domain)
		//    - local part: alphanumerics and !#$%&'*+/=?^_`{|}~.-
		//    - domain: labels of alphanumerics + hyphens, separated by dots, ending in a letter
		const emailRegex = new RegExp(
			// local-part
			`^[a-zA-Z0-9!#$%&'*+/=?^_\`{|}~.-]+` +
				// @ symbol
				`@` +
				// domain labels
				`(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+` +
				// TLD (at least 2 letters)
				`[a-zA-Z]{2,}$`
		);

		if (!emailRegex.test(trimmed)) {
			return { valid: false, error: 'Email format is invalid.' };
		}

		// 5. Split local & domain for further checks
		const [localPart, domain] = trimmed.split('@');

		// 6. Local‐part length constraint
		if (localPart.length > 64) {
			return {
				valid: false,
				error: 'The part before “@” must be 64 characters or fewer.'
			};
		}

		// 7. Domain label length constraints
		const labels = domain.split('.');
		for (const label of labels) {
			if (label.length > 63) {
				return {
					valid: false,
					error: 'Each part of the domain must be 63 characters or fewer.'
				};
			}
		}

		// 8. All checks passed
		return { valid: true };
	}
}
