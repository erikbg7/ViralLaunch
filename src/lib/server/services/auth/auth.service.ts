import { hash, verify } from '@node-rs/argon2';
import { type RequestEvent } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { SessionService } from '$lib/server/services/auth/session.service';
import { UserRepository } from '$lib/server/repositories/user.repository';
import { PreferencesRepository } from '$lib/server/repositories/preferences.repository';

interface EmailValidationResult {
	valid: boolean;
	error?: string;
}

export class AuthService {
	static async logout(event: RequestEvent) {
		const sessionId = event.locals.session?.id;
		if (!sessionId) {
			return;
		}
		await SessionService.invalidateSession(sessionId);
		SessionService.deleteCookie(event);
	}

	static async register(
		event: RequestEvent,
		email: string | null,
		password: string | null
	) {
		if (email === null || password === null) {
			throw new Error('Email and password are required');
		}
		if (!this.validateEmail(email)) {
			throw new Error('Invalid email');
		}
		if (!this.validatePassword(password)) {
			throw new Error('Invalid password');
		}

		const existingUser = await UserRepository.get(email);
		if (existingUser) {
			throw new Error('User already exists');
		}

		const userId = this.generateId();
		const passwordHash = await this.generatePasswordHash(password);
		const user = await UserRepository.create({
			id: userId,
			email,
			passwordHash,
			username: null,
			googleId: null,
			avatar: null
		});
		await PreferencesRepository.create({ userId: user.id });

		const sessionToken = SessionService.generateSessionToken();
		const session = await SessionService.createSession(sessionToken, user.id);
		SessionService.setCookie(event, sessionToken, session.expiresAt);
	}

	static async login(
		event: RequestEvent,
		email: string | null,
		password: string | null
	) {
		if (email === null || password === null) {
			throw new Error('Email and password are required');
		}
		if (!this.validateEmail(email)) {
			throw new Error('Invalid email');
		}
		if (!this.validatePassword(password)) {
			throw new Error('Invalid password');
		}

		const existingUser = await UserRepository.get(email);
		if (!existingUser) {
			throw new Error('Incorrect email or password');
		}

		if (!existingUser.passwordHash) {
			throw new Error('Please login with Google');
		}

		const validPassword = await this.verifyPassword(
			password,
			existingUser.passwordHash
		);

		if (!validPassword) {
			throw new Error('Incorrect email or password');
		}

		const sessionToken = SessionService.generateSessionToken();
		const session = await SessionService.createSession(
			sessionToken,
			existingUser.id
		);
		SessionService.setCookie(event, sessionToken, session.expiresAt);
	}

	// TODO: this should be moved to auth service
	static generateId() {
		// ID with 120 bits of entropy, or about the same as UUID v4.
		const bytes = crypto.getRandomValues(new Uint8Array(15));
		const id = encodeBase32LowerCase(bytes);
		return id;
	}

	// TODO: this should be moved to auth service
	static async generatePasswordHash(password: string) {
		// recommended minimum parameters
		return await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
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
