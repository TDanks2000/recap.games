import { sql } from "drizzle-orm";
import { unique } from "drizzle-orm/sqlite-core";
import { createTable } from "./createTable";

export const donations = createTable(
	"donations",
	(d) => ({
		id: d
			.text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		provider: d.text().notNull(),
		providerTransactionId: d.text().notNull(),
		amountInCents: d.integer().notNull(),
		currency: d.text().notNull(),
		donatorName: d.text().notNull(),
		donatorMessage: d.text(),
		donatedAt: d.integer({ mode: "timestamp" }).notNull(),
		rawData: d.text({ mode: "json" }).notNull(),
		createdAt: d
			.integer({ mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	}),
	(donationsTable) => [
		unique("provider_unique_constraint").on(
			donationsTable.provider,
			donationsTable.providerTransactionId,
		),
	],
);
