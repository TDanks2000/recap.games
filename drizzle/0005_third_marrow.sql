CREATE TABLE `recap.games_donations` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`providerTransactionId` text NOT NULL,
	`amountInCents` integer NOT NULL,
	`currency` text NOT NULL,
	`donatorName` text NOT NULL,
	`donatorMessage` text,
	`donatedAt` integer NOT NULL,
	`rawData` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_unique_constraint` ON `recap.games_donations` (`provider`,`providerTransactionId`);