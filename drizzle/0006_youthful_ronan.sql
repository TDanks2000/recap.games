CREATE TABLE `recap.games_blog_post_tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`postId` integer NOT NULL,
	`tagId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `recap.games_blog_post`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `recap.games_blog_tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recap.games_blog_tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`color` text(7),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recap.games_blog_tag_name_unique` ON `recap.games_blog_tag` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `recap.games_blog_tag_slug_unique` ON `recap.games_blog_tag` (`slug`);--> statement-breakpoint
ALTER TABLE `recap.games_conference` ADD `year` integer DEFAULT 2025;--> statement-breakpoint
ALTER TABLE `recap.games_game` ADD `year` integer DEFAULT 2025;