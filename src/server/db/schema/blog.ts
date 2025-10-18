import { relations, sql } from "drizzle-orm";
import { users } from "./auth";
import { createTable } from "./createTable";

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

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
	author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
	analytics: one(blogPostAnalytics, {
		fields: [blogPosts.id],
		references: [blogPostAnalytics.postId],
	}),
	comments: many(blogComments),
	views: many(blogPostViews),
	tags: many(blogPostTags),
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
	uniqueViewCount: d.integer().default(0), // Count of unique visitors
	registeredViewCount: d.integer().default(0), // Count of logged-in user views
	anonViewCount: d.integer().default(0), // Count of anonymous views
	lastViewedAt: d.integer({ mode: "timestamp" }),
	averageReadTime: d.integer().default(0), // Average time spent on post in seconds
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

// Blog Post Views Table for debounced view tracking
export const blogPostViews = createTable("blog_post_view", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	postId: d
		.integer()
		.notNull()
		.references(() => blogPosts.id),
	userId: d.text({ length: 255 }).references(() => users.id), // nullable for guests
	sessionId: d.text({ length: 255 }), // for anonymous session tracking
	referrer: d.text(), // track where the visitor came from
	readTime: d.integer(), // track how long the user spent on the page
	viewedAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
}));

export const blogPostViewsRelations = relations(blogPostViews, ({ one }) => ({
	post: one(blogPosts, {
		fields: [blogPostViews.postId],
		references: [blogPosts.id],
	}),
	user: one(users, {
		fields: [blogPostViews.userId],
		references: [users.id],
	}),
}));

// Blog Tags Table
export const blogTags = createTable("blog_tag", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	name: d.text().notNull().unique(),
	slug: d.text().notNull().unique(),
	description: d.text(),
	color: d.text({ length: 7 }), // Hex color code for tag display
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
	posts: many(blogPostTags),
}));

// Blog Post Tags Junction Table (Many-to-Many)
export const blogPostTags = createTable("blog_post_tag", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	postId: d
		.integer()
		.notNull()
		.references(() => blogPosts.id, { onDelete: "cascade" }),
	tagId: d
		.integer()
		.notNull()
		.references(() => blogTags.id, { onDelete: "cascade" }),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
	post: one(blogPosts, {
		fields: [blogPostTags.postId],
		references: [blogPosts.id],
	}),
	tag: one(blogTags, {
		fields: [blogPostTags.tagId],
		references: [blogTags.id],
	}),
}));
