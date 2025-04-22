import type { streams } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Stream = InferSelectModel<typeof streams>;
