CREATE TABLE `recap.games_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `recap.games_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `recap.games_account` (`userId`);--> statement-breakpoint
CREATE TABLE `recap.games_blog_comment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`postId` integer NOT NULL,
	`authorId` text(255) NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `recap.games_blog_post`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`authorId`) REFERENCES `recap.games_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recap.games_blog_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`authorId` text(255) NOT NULL,
	`published` integer DEFAULT false,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`authorId`) REFERENCES `recap.games_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recap.games_blog_post_slug_unique` ON `recap.games_blog_post` (`slug`);--> statement-breakpoint
CREATE TABLE `recap.games_conference` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`startTime` integer,
	`endTime` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recap.games_conference_name_unique` ON `recap.games_conference` (`name`);--> statement-breakpoint
CREATE TABLE `recap.games_game` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`releaseDate` text,
	`genres` text DEFAULT (json_array()) NOT NULL,
	`exclusive` text DEFAULT (json_array()) NOT NULL,
	`features` text DEFAULT (json_array()) NOT NULL,
	`developer` text DEFAULT (json_array()) NOT NULL,
	`publisher` text DEFAULT (json_array()) NOT NULL,
	`hidden` integer DEFAULT false,
	`conferenceId` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`conferenceId`) REFERENCES `recap.games_conference`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recap.games_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text DEFAULT 'Video' NOT NULL,
	`link` text NOT NULL,
	`gameId` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`gameId`) REFERENCES `recap.games_game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recap.games_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `recap.games_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `recap.games_session` (`userId`);--> statement-breakpoint
CREATE TABLE `recap.games_stream` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`conferenceId` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`conferenceId`) REFERENCES `recap.games_conference`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recap.games_stream_title_unique` ON `recap.games_stream` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `recap.games_stream_link_unique` ON `recap.games_stream` (`link`);--> statement-breakpoint
CREATE TABLE `recap.games_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`username` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`emailVerified` integer DEFAULT (unixepoch()),
	`image` text(255),
	`password` text(255),
	`role` text(255) DEFAULT 'USER'
);
--> statement-breakpoint
CREATE TABLE `recap.games_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
