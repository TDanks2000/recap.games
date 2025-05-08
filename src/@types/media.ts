import type { InferSelectModel } from "drizzle-orm";
import type { media } from "@/server/db/schema";

export type Media = InferSelectModel<typeof media>;
