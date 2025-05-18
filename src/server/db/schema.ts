import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "next-auth/adapters";
import {
	type Feature,
	type Genre,
	MediaType,
	type Platform,
	UserRole,
} from "@/@types/db";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `recap.games_${name}`);

export const users = createTable("user", (d) => ({
	id: d
		.text({ length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: d.text({ length: 255 }),
	username: d.text({ length: 255 }).notNull(),
	email: d.text({ length: 255 }).notNull(),
	emailVerified: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
	image: d.text({ length: 255 }),
	password: d.text({ length: 255 }),
	role: d.text({ length: 255 }).$type<UserRole>().default(UserRole.USER),
}));

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
}));

export const accounts = createTable(
	"account",
	(d) => ({
		userId: d
			.text({ length: 255 })
			.notNull()
			.references(() => users.id),
		type: d.text({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
		provider: d.text({ length: 255 }).notNull(),
		providerAccountId: d.text({ length: 255 }).notNull(),
		refresh_token: d.text(),
		access_token: d.text(),
		expires_at: d.integer(),
		token_type: d.text({ length: 255 }),
		scope: d.text({ length: 255 }),
		id_token: d.text(),
		session_state: d.text({ length: 255 }),
	}),
	(t) => [
		primaryKey({
			columns: [t.provider, t.providerAccountId],
		}),
		index("account_user_id_idx").on(t.userId),
	],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
	"session",
	(d) => ({
		sessionToken: d.text({ length: 255 }).notNull().primaryKey(),
		userId: d
			.text({ length: 255 })
			.notNull()
			.references(() => users.id),
		expires: d.integer({ mode: "timestamp" }).notNull(),
	}),
	(t) => [index("session_userId_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
	"verification_token",
	(d) => ({
		identifier: d.text({ length: 255 }).notNull(),
		token: d.text({ length: 255 }).notNull(),
		expires: d.integer({ mode: "timestamp" }).notNull(),
	}),
	(t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Game Table
export const games = createTable("game", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	title: d.text().notNull(),
	releaseDate: d.text(),
	genres: d
		.text({
			mode: "json",
		})
		.notNull()
		.$type<Array<Genre>>()
		.default(sql`(json_array())`),
	exclusive: d
		.text({
			mode: "json",
		})
		.notNull()
		.$type<Array<Platform>>()
		.default(sql`(json_array())`),
	features: d
		.text({
			mode: "json",
		})
		.notNull()
		.$type<Array<Feature>>()
		.default(sql`(json_array())`),
	developer: d
		.text({
			mode: "json",
		})
		.notNull()
		.$type<Array<string>>()
		.default(sql`(json_array())`),
	publisher: d
		.text({
			mode: "json",
		})
		.notNull()
		.$type<Array<string>>()
		.default(sql`(json_array())`),
	hidden: d
		.integer({
			mode: "boolean",
		})
		.default(false),
	conferenceId: d.integer().references(() => conferences.id),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

// Conference Table
export const conferences = createTable("conference", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	name: d.text().notNull().unique(),
	startTime: d.integer({ mode: "timestamp" }),
	endTime: d.integer({ mode: "timestamp" }),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

// Define relations between conferences and games
export const conferencesRelations = relations(conferences, ({ many }) => ({
	games: many(games),
	streams: many(streams),
}));

// Media Table
export const media = createTable("media", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	type: d.text().notNull().$type<MediaType>().default(MediaType.Video),
	link: d.text().notNull(),
	gameId: d.integer().references(() => games.id),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

// Define relations between games and media
export const gamesRelations = relations(games, ({ many, one }) => ({
	media: many(media),
	conference: one(conferences, {
		fields: [games.conferenceId],
		references: [conferences.id],
	}),
}));

export const mediaRelations = relations(media, ({ one }) => ({
	game: one(games, { fields: [media.gameId], references: [games.id] }),
}));

// Stream Table
export const streams = createTable("stream", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	title: d.text().notNull().unique(),
	link: d.text().notNull(),
	conferenceId: d.integer().references(() => conferences.id),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

// Define relations for streams
export const streamsRelations = relations(streams, ({ one }) => ({
	conference: one(conferences, {
		fields: [streams.conferenceId],
		references: [conferences.id],
	}),
}));

/**
 * Blog Posts Table
 * Stores blog entries written in Markdown and links them to a user.
 */
export const blogPosts = createTable("blog_post", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	title: d.text().notNull(),
	description: d.text(),
	slug: d.text().notNull().unique(),
	content: d.text().notNull(),
	authorId: d
		.text({ length: 255 })
		.notNull()
		.references(() => users.id),
	published: d.integer({ mode: "boolean" }).default(false),
	scheduledAt: d.integer({ mode: "timestamp" }),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
	author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
	analytics: one(blogPostAnalytics, {
		fields: [blogPosts.id],
		references: [blogPostAnalytics.postId],
	}),
}));

export const blogComments = createTable("blog_comment", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	postId: d
		.integer()
		.notNull()
		.references(() => blogPosts.id),
	authorId: d
		.text({ length: 255 })
		.notNull()
		.references(() => users.id),
	content: d.text().notNull(),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
}));

export const blogCommentsRelations = relations(blogComments, ({ one }) => ({
	post: one(blogPosts, {
		fields: [blogComments.postId],
		references: [blogPosts.id],
	}),
	author: one(users, {
		fields: [blogComments.authorId],
		references: [users.id],
	}),
}));

export const blogPostAnalytics = createTable("blog_post_analytics", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	postId: d
		.integer()
		.notNull()
		.references(() => blogPosts.id)
		.unique(),
	viewCount: d.integer().default(0),
	likeCount: d.integer().default(0),
	commentCount: d.integer().default(0),
	lastViewedAt: d.integer({ mode: "timestamp" }),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

export const blogPostAnalyticsRelations = relations(
	blogPostAnalytics,
	({ one }) => ({
		post: one(blogPosts, {
			fields: [blogPostAnalytics.postId],
			references: [blogPosts.id],
		}),
	}),
);
