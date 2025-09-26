import { relations, sql } from "drizzle-orm";
import { MediaType } from "@/@types";
import { createTable } from "./createTable";
import { games } from "./game";

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

export const mediaRelations = relations(media, ({ one }) => ({
	game: one(games, { fields: [media.gameId], references: [games.id] }),
}));
