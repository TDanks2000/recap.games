import { relations, sql } from "drizzle-orm";
import { createTable } from "./createTable";
import { games } from "./game";
import { streams } from "./stream";

export const conferences = createTable("conference", (d) => ({
	id: d.integer().primaryKey({ autoIncrement: true }),
	name: d.text().notNull().unique(),
	startTime: d.integer({ mode: "timestamp" }),
	endTime: d.integer({ mode: "timestamp" }),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	year: d.integer().default(2025),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

// Define relations between conferences and games
export const conferencesRelations = relations(conferences, ({ many }) => ({
	games: many(games),
	streams: many(streams),
}));
