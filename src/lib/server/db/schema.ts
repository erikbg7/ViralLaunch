import z from 'zod';
import {
	boolean,
	date,
	integer,
	pgTable,
	real,
	serial,
	text,
	timestamp,
	varchar,
	primaryKey,
	unique,
	index
} from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema
} from 'drizzle-zod';

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

export const preferences = pgTable('preferences', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
		.unique()
});

export const userSubreddits = pgTable(
	'user_subreddits',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		subredditId: integer('subreddit_id')
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
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	url: text('url').notNull().unique(),
	tracked: boolean('tracked').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull()
});

export const subredditRecord = pgTable(
	'subreddit_record',
	{
		id: serial('id').primaryKey(),
		subredditId: integer('subreddit_id')
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

export const subredditHourlyAvg = pgTable('subreddit_hourly_avg', {
	id: serial('id').primaryKey(),
	subredditId: integer('subreddit_id')
		.notNull()
		.references(() => subreddit.id, { onDelete: 'cascade' }),

	dayOfWeek: integer('day_of_week').notNull(), // 1 = Monday, ..., 7 = Sunday
	hourOfDay: integer('hour_of_day').notNull(), // 0 = 00:00, 23 = 23:00

	avgOnlineUsers: real('avg_online_users').notNull(), // Floating point for accuracy
	lastRecord: integer('last_record').notNull().default(0),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),

	weekStartDate: date('week_start_date').notNull() // Which week this belongs to
});

export const userUpdateSchema = createUpdateSchema(user);
export const userSelectSchema = createSelectSchema(user);
export const sessionSelectSchema = createSelectSchema(session);

export const userInsertSchema = createInsertSchema(user);
export const sessionInsertSchema = createInsertSchema(session);

export const platformInsertSchema = z.object({
	name: z.string(),
	description: z.string(),
	url: z.string(),
	custom: z.boolean()
});

export const redditRemoveSchema = z.object({
	id: z.number()
});

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

export type UserSubreddits = typeof userSubreddits.$inferSelect;
export type Subreddit = typeof subreddit.$inferSelect;

export type SubredditRecord = typeof subredditRecord.$inferSelect;
