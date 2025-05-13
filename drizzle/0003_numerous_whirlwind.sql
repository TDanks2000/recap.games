CREATE TABLE `recap.games_blog_post_analytics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`postId` integer NOT NULL,
	`viewCount` integer DEFAULT 0,
	`likeCount` integer DEFAULT 0,
	`commentCount` integer DEFAULT 0,
	`lastViewedAt` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`postId`) REFERENCES `recap.games_blog_post`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recap.games_blog_post_analytics_postId_unique` ON `recap.games_blog_post_analytics` (`postId`);