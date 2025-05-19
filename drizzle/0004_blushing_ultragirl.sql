CREATE TABLE `recap.games_blog_post_view` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`postId` integer NOT NULL,
	`userId` text(255),
	`sessionId` text(255),
	`referrer` text,
	`readTime` integer,
	`viewedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `recap.games_blog_post`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `recap.games_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP INDEX `recap.games_stream_link_unique`;--> statement-breakpoint
ALTER TABLE `recap.games_blog_post_analytics` ADD `uniqueViewCount` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `recap.games_blog_post_analytics` ADD `registeredViewCount` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `recap.games_blog_post_analytics` ADD `anonViewCount` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `recap.games_blog_post_analytics` ADD `averageReadTime` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `recap.games_blog_post_analytics` DROP COLUMN `likeCount`;--> statement-breakpoint
ALTER TABLE `recap.games_blog_post_analytics` DROP COLUMN `commentCount`;