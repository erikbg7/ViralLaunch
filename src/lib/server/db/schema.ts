import { pgTable, serial, text, integer, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
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

export const launch = pgTable('launch', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const platform = pgTable('platform', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	description: text('description').default(''),
	url: text('url').notNull().unique(),
	launched: boolean('launched').default(false),
	launchId: integer('launch_id')
		.notNull()
		.references(() => launch.id)
});

// TODO: platforms should be fixed, we just need a int to represent each platform
// each bit will represent a platform
// platforms_activation = 0b00000001
// platforms_launch = 0b00000010
// this will save us a lot of space in the database
// we can use a bit mask to check if a platform is activated or launched

// TODO: use custom_platform table to store custom platforms that a user can add
// e.g. reddit/r/indoor_boulder

export const userSelectSchema = createSelectSchema(user);
export const sessionSelectSchema = createSelectSchema(session);
export const launchSelectSchema = createSelectSchema(launch);
export const platformSelectSchema = createSelectSchema(platform);

export const userInsertSchema = createInsertSchema(user);
export const sessionInsertSchema = createInsertSchema(session);
export const launchInsertSchema = createInsertSchema(launch).pick({ name: true, userId: true });
export const platformInsertSchema = createInsertSchema(platform);

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Launch = typeof launch.$inferSelect;
export type ProductWithPlatforms = { product: Launch } & { platforms: Platform[] };
export type Platform = typeof platform.$inferSelect;
