import type { games } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import type { Conference } from "./conferences";
import type { Media } from "./media";

export type Game = InferSelectModel<typeof games>;

export interface GameWithRelations extends Game {
  media: Array<Media> | null | undefined;
  conferences: Conference | null | undefined;
}
