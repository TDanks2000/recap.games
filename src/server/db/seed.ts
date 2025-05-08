import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { reset, seed } from "drizzle-seed";

import * as schema from "./schema";
import {
	accounts,
	conferences,
	games,
	media,
	sessions,
	streams,
	users,
	verificationTokens,
} from "./schema";

// Import your table definitions /schema';

const DATABASE_URL = process.env.DATABASE_URL;

export async function SEED() {
	if (!DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined");
	}
	// Initialize the libsql client using the DB_FILE_NAME from your .env
	const client = createClient({ url: DATABASE_URL });
	const db = drizzle(client);

	// first reset db
	await reset(db, schema);

	// Run the seed function with all your tables
	await seed(db, {
		users: users,
		accounts: accounts,
		sessions: sessions,
		verificationTokens: verificationTokens,
		conferences: conferences,
		games: games,
		media: media,
		streams: streams,
	}).refine((f) => ({
		games: {
			columns: {
				title: f.jobTitle(),
				releaseDate: f.date(),
			},
		},
	}));

	console.log("Database seeding completed successfully.");
}

SEED().catch((e) => {
	console.error("Database seeding failed.");
	console.error(e);
});
