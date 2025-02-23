import z from 'zod';
import {
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	boolean,
	varchar,
	real,
	date
} from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';

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
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const product = pgTable('product', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const platformLaunch = pgTable('platform_launch', {
	id: serial('id').primaryKey(),
	launched: boolean('launched').default(false),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id),
	platformId: integer('platform_id')
		.notNull()
		.references(() => platform.id)
});

export const platform = pgTable('platform', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	description: text('description').default(''),
	url: text('url').notNull().unique(),
	custom: boolean('custom').default(false)
});

export const productSubreddit = pgTable('product_subreddit', {
	id: serial('id').primaryKey(),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	subredditId: integer('subreddit_id')
		.notNull()
		.references(() => subreddit.id, { onDelete: 'cascade' })
});

export const subreddit = pgTable('subreddit', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	url: text('url').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const subredditHourlyAvg = pgTable('subreddit_hourly_avg', {
	id: serial('id').primaryKey(),
	subredditId: integer('subreddit_id')
		.notNull()
		.references(() => subreddit.id, { onDelete: 'cascade' }),

	dayOfWeek: integer('day_of_week').notNull(), // 1 = Monday, ..., 7 = Sunday
	hourOfDay: integer('hour_of_day').notNull(), // 0 = 00:00, 23 = 23:00

	avgOnlineUsers: real('avg_online_users').notNull(), // Floating point for accuracy

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
export const productInsertSchema = createInsertSchema(product).pick({ name: true, userId: true });
export const platformInsertSchema = z.object({
	name: z.string(),
	description: z.string(),
	url: z.string(),
	custom: z.boolean()
});

export const redditRemoveSchema = z.object({
	id: z.number()
});

export const redditInsertSchema = z.object({
	url: z
		.string()
		.url()
		.regex(/reddit.com\/r\/\w+/)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Product = typeof product.$inferSelect;
export type Platform = typeof platform.$inferSelect;
export type PlatformInsert = typeof platform.$inferInsert;

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
