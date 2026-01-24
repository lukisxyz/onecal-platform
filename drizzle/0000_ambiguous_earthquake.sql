CREATE TABLE `mentors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet_address` text NOT NULL,
	`full_name` text NOT NULL,
	`username` text NOT NULL,
	`bio` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`transaction_hash` text,
	`block_number` integer,
	`registered_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mentors_wallet_address_unique` ON `mentors` (`wallet_address`);--> statement-breakpoint
CREATE UNIQUE INDEX `mentors_username_unique` ON `mentors` (`username`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`wallet_address` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);