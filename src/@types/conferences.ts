import type { conferences } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import type { GameWithRelations } from "./games";
import type { Stream } from "./streams";

export type Conference = InferSelectModel<typeof conferences>;

export interface ConferenceWithRelations extends Conference {
	games: Array<GameWithRelations> | null | undefined;
	streams: Array<Stream> | null | undefined;
}
