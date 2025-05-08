import { sql } from "drizzle-orm";
import cron from "node-cron";
import { db } from "@/server/db";
import { blogPosts } from "@/server/db/schema";

const TZ = process.env.SCHEDULE_TIMEZONE || "UTC";

cron.schedule(
	"* * * * *",
	async () => {
		try {
			const updated = await db
				.update(blogPosts)
				.set({
					published: true,
					scheduledAt: null,
					updatedAt: sql`(unixepoch())`,
				})
				.where(
					sql`
          ${blogPosts.scheduledAt} IS NOT NULL
          AND ${blogPosts.scheduledAt} <= unixepoch()
          AND ${blogPosts.published} = 0
        `,
				)
				.returning({ id: blogPosts.id });

			if (updated.length) {
				console.log(
					`✅ [${TZ}] published posts:`,
					updated.map((r) => r.id),
				);
			}
		} catch (err) {
			console.error(`❌ [${TZ}] error publishing scheduled posts:`, err);
		}
	},
	{ timezone: TZ },
);

console.log("📚 publishScheduledPosts job initialized.");
