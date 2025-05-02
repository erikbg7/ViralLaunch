import { db } from '$lib/server/db';
import {
	preferences,
	type Preferences,
	type PreferencesInsert,
	type PreferencesUpdate
} from '$lib/server/db/schema';
import { getTableColumns, eq, and, sql } from 'drizzle-orm';

const allColumns = getTableColumns(preferences);
const { id, userId, ...selectedColumns } = allColumns;

export class PreferencesRepository {
	static async create(newPreferences: PreferencesInsert) {
		const [createdPreferences] = await db
			.insert(preferences)
			.values(newPreferences)
			.returning(selectedColumns)
			.execute();
		return createdPreferences;
	}
	static async get(userId: Preferences['userId']) {
		const [retrievedPreferences] = await db
			.select(selectedColumns)
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
			.returning(selectedColumns);
		return updatePreferences;
	}
	static async find(params: Partial<Preferences>) {
		const conditions = [];

		if (params.notificationDay) {
			conditions.push(eq(preferences.notificationDay, params.notificationDay));
		}
		if (params.notificationEmail) {
			conditions.push(
				eq(preferences.notificationEmail, params.notificationEmail)
			);
		}
		if (params.notificationFrequency) {
			conditions.push(
				eq(preferences.notificationFrequency, params.notificationFrequency)
			);
		}
		if (params.notificationTime) {
			conditions.push(
				eq(preferences.notificationTime, params.notificationTime)
			);
		}

		return await db
			.select(getTableColumns(preferences))
			.from(preferences)
			.where(and(...conditions));
	}
	static async getNotificationCompliantUsers() {
		const result = await db.execute<Preferences>(sql`
			SELECT 
				p.id                            AS "id",
    			p.user_id                       AS "userId",
    			p.week_start                    AS "weekstart",
    			p.time_zone                     AS "timezone",
    			p.time_format                   AS "timeformat",
    			p.notification_email            AS "notificationEmail",
    			p.notification_day              AS "notificationDay",
    			p.notification_frequency        AS "notificationFrequency",
    			p.notification_time             AS "notificationTime"
			FROM preferences p
			WHERE p.notification_frequency = 'daily'
  			AND TO_CHAR(
   				date_trunc('hour', timezone(p.time_zone::text, now() at time zone time_zone::text))
    			+ interval '30 minutes'
      			* floor(
          			date_part('minute', timezone(p.time_zone::text, now() at time zone time_zone::text))::int / 30.0
        		),
    			'HH24:MI'
  				) = notification_time;
		`);

		return result;
	}
}
