import { relations, sql } from "drizzle-orm";
import type { Feature, Genre, Platform } from "@/@types/db";
import { conferences } from "./conference";
import { createTable } from "./createTable";
import { media } from "./media";

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
	year: d.integer().default(2025),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

export const gamesRelations = relations(games, ({ many, one }) => ({
	media: many(media),
	conference: one(conferences, {
		fields: [games.conferenceId],
		references: [conferences.id],
	}),
}));
