import z from 'zod';
import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	primaryKey,
	unique,
	index,
	pgEnum
} from 'drizzle-orm/pg-core';
import {
	NotificationFrequency,
	notificationHours,
	TimeFormat,
	TimeZone,
	WeekDay,
	WeekStart
} from '../../constants';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	googleId: text('google_id').unique(),
	email: text('email').unique().notNull(),
	passwordHash: text('password_hash'),
	username: text('username'),
	avatar: text('avatar'),

	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export const weekStartEnum = pgEnum('week_start', enumToPgEnum(WeekStart));

export const timezoneEnum = pgEnum('tz', enumToPgEnum(TimeZone));

export const timeformatEnum = pgEnum('t_format', enumToPgEnum(TimeFormat));

export const notificationDayEnum = pgEnum('weekdays', enumToPgEnum(WeekDay));

export const notificationFrequencyEnum = pgEnum(
	'freq',
	enumToPgEnum(NotificationFrequency)
);
export const notificationTimeEnum = pgEnum(
	'hours',
	notificationHours as [string, ...string[]]
);

// TODO: The user should be able to choose the notification mail as well,
// by default it should be the same as the email
export const preferences = pgTable('preferences', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
		.unique(),
	weekstart: weekStartEnum('week_start').notNull().default(WeekStart.SUNDAY),
	timezone: timezoneEnum('time_zone').notNull().default(TimeZone.UTC),
	timeformat: timeformatEnum('time_format').notNull().default(TimeFormat.AM_PM),
	notificationDay: notificationDayEnum('notification_day')
		.notNull()
		.default(WeekDay.MONDAY),
	notificationFrequency: notificationFrequencyEnum('notificaton_frequency')
		.notNull()
		.default(NotificationFrequency.NEVER),
	notificationTime: notificationTimeEnum('notification_time')
		.notNull()
		.default('08:30')
});

export const userSubreddits = pgTable(
	'user_subreddits',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		subredditId: text('subreddit_id')
			.notNull()
			.references(() => subreddit.id, { onDelete: 'cascade' })
	},
	(table) => [
		primaryKey({
			name: 'user_subreddit_id',
			columns: [table.userId, table.subredditId]
		})
	]
);

export const subreddit = pgTable('subreddit', {
	id: text('id').primaryKey().unique(),
	url: text('url').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull()
});

export const subredditRecord = pgTable(
	'subreddit_record',
	{
		id: serial('id').primaryKey(),
		subredditId: text('subreddit_id')
			.notNull()
			.references(() => subreddit.id, { onDelete: 'cascade' }),

		users: integer('users').notNull(),

		// TODO: We should be able to get completely rid of intervals and floor the timestamp using SQL instead
		interval: integer('interval').notNull(), // 72 intervals 0 = 00:00, 71 = 23:40

		// Timestamp rounded to the nearest 20 minutes
		timestamp: timestamp('timestamp', {
			withTimezone: false,
			mode: 'string',
			precision: 0
		})
			.defaultNow()
			.notNull()
	},
	(table) => [
		unique('unique_subreddit_timestamp').on(table.subredditId, table.timestamp),
		index('timestamp_idx').on(table.timestamp)
	]
);

export const subredditNameInsetSchema = z.string();
export const subredditUrlInsertSchema = z
	.string()
	.url()
	.regex(/reddit.com\/r\/\w+/);

export const subredditInsertSchema = z.object({
	subreddit: subredditUrlInsertSchema.or(subredditNameInsetSchema)
});

export type Session = typeof session.$inferSelect;
export type SessionInsert = typeof session.$inferInsert;
export type SessionUpdate = Partial<typeof session.$inferInsert>;

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
export type UserUpdate = Partial<typeof user.$inferInsert>;

export type Preferences = typeof preferences.$inferSelect;
export type PreferencesInsert = typeof preferences.$inferInsert;
export type PreferencesUpdate = Partial<typeof preferences.$inferInsert>;

export type UserSubreddits = typeof userSubreddits.$inferSelect;
export type Subreddit = typeof subreddit.$inferSelect;

export type SubredditRecord = typeof subredditRecord.$inferSelect;
