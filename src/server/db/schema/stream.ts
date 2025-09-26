import { relations, sql } from "drizzle-orm";
import { conferences } from "./conference";
import { createTable } from "./createTable";

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

export const streamsRelations = relations(streams, ({ one }) => ({
	conference: one(conferences, {
		fields: [streams.conferenceId],
		references: [conferences.id],
	}),
}));
