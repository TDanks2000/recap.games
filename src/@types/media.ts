import type { media } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Media = InferSelectModel<typeof media>;
