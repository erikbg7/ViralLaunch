import { db } from '$lib/server/db';
import {
	preferences,
	type Preferences,
	type PreferencesInsert,
	type PreferencesUpdate
} from '$lib/server/db/schema';
import { getTableColumns, eq } from 'drizzle-orm';

export class PreferencesRepository {
	static async create(newPreferences: PreferencesInsert) {
		const [createdPreferences] = await db
			.insert(preferences)
			.values(newPreferences)
			.returning(getTableColumns(preferences))
			.execute();
		return createdPreferences;
	}
	static async get(userId: Preferences['userId']) {
		const [retrievedPreferences] = await db
			.select()
			.from(preferences)
			.where(eq(preferences.userId, userId))
			.limit(1);

		return retrievedPreferences;
	}
	static async update(userId: string, updateWith: PreferencesUpdate) {
		const [updatePreferences] = await db
			.update(preferences)
			.set(updateWith)
			.where(eq(preferences.userId, userId))
			.returning(getTableColumns(preferences));
		return updatePreferences;
	}
}
