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
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
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

export const product = pgTable('product', (t) => ({
	id: t.serial('id').primaryKey(),
	name: t.varchar('name', { length: 128 }).notNull().unique(),
	createdAt: t
		.timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),
	userId: t
		.text('user_id')
		.notNull()
		.references(() => user.id)
}));

export const platformLaunch = pgTable('platform_launch', {
	id: serial('id').primaryKey(),
	launched: boolean('launched').default(false),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	platformId: integer('platform_id')
		.notNull()
		.references(() => platform.id, { onDelete: 'cascade' })
});

export const platform = pgTable('platform', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	description: text('description').default(''),
	url: text('url').notNull().unique(),
	custom: boolean('custom').default(false)
});

export const productSubreddit = pgTable(
	'product_subreddit',
	{
		productId: integer('product_id')
			.notNull()
			.references(() => product.id, { onDelete: 'cascade' }),
		subredditId: integer('subreddit_id')
			.notNull()
			.references(() => subreddit.id, { onDelete: 'cascade' })
	},
	(table) => [
		primaryKey({ name: 'id', columns: [table.productId, table.subredditId] })
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

		interval: integer('interval').notNull(), // 72 intervals 0 = 00:00, 71 = 23:40

		// Timestamp rounded to the nearest 20 minutes
		timestamp: timestamp('timestamp', {
			withTimezone: false,
			mode: 'date',
			precision: 0
		})
			.defaultNow()
			.notNull()
	},
	(table) => ({
		subredditTimestampUnique: unique().on(table.subredditId, table.timestamp),
		timestampIndex: index('timestamp_idx').on(table.timestamp)
	})
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

// TODO: platforms should be fixed, we just need a int to represent each platform
// each bit will represent a platform
// platforms_activation = 0b00000001
// platforms_product = 0b00000010
// this will save us a lot of space in the database
// we can use a bit mask to check if a platform is activated

// TODO: use custom_platform table to store custom platforms that a user can add
// e.g. reddit/r/indoor_boulder

export const userSelectSchema = createSelectSchema(user);
export const sessionSelectSchema = createSelectSchema(session);
export const productSelectSchema = createSelectSchema(product);
export const platformSelectSchema = createSelectSchema(platform);

export const userInsertSchema = createInsertSchema(user);
export const sessionInsertSchema = createInsertSchema(session);
export const productInsertSchema = createInsertSchema(product).pick({
	name: true,
	userId: true
});
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
type SubredditInsertSchema = z.infer<typeof subredditInsertSchema>;

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Product = typeof product.$inferSelect;
export type Platform = typeof platform.$inferSelect;
export type PlatformInsert = typeof platform.$inferInsert;
export type Subreddit = typeof subreddit.$inferSelect;

export type SubredditRecord = typeof subredditRecord.$inferSelect;
export type WeeklySubredditRecords = Array<Array<SubredditRecord>>;

export type PlatformLaunch = typeof platformLaunch.$inferSelect;
export type ProductWithPlatforms = { product: Product } & {
	platforms: Array<{
		id: Platform['id'];
		name: Platform['name'];
		description: Platform['description'];
		url: Platform['url'];
		launched: PlatformLaunch['launched'];
		custom: Platform['custom'];
	}>;
};
