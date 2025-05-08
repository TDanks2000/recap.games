import type { InferSelectModel } from "drizzle-orm";
import type { streams } from "@/server/db/schema";

export type Stream = InferSelectModel<typeof streams>;
