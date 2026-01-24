import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Users table - stores user information
 */
export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
	name: text("name").notNull(),
	walletAddress: text("wallet_address").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`CURRENT_TIMESTAMP`,
	),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * Mentor registration status enum
 */
export const MentorStatus = {
	PENDING: "pending",
	REGISTERED: "registered",
	REJECTED: "rejected",
} as const;

export type MentorStatus = (typeof MentorStatus)[keyof typeof MentorStatus];

/**
 * Mentors table - stores mentor registration information
 * following best practices for data integrity and security
 */
export const mentors = sqliteTable("mentors", {
	/**
	 * Primary key - auto-incrementing ID
	 */
	id: integer("id").primaryKey({ autoIncrement: true }),

	/**
	 * Wallet address - unique identifier for Web3 authentication
	 * Stored as lowercase for consistency and case-insensitive uniqueness
	 */
	walletAddress: text("wallet_address").notNull().unique(),

	/**
	 * Full name - mentor's display name
	 * Not unique to allow same person to have multiple wallets if needed
	 */
	fullName: text("full_name").notNull(),

	/**
	 * Username - unique identifier for the mentor
	 * Must be unique across all mentors
	 * Will be validated on-chain as well
	 */
	username: text("username").notNull().unique(),

	/**
	 * Bio - mentor's description/pitch
	 * Stored as text with reasonable length constraints
	 */
	bio: text("bio").notNull(),

	/**
	 * Registration status - tracks the state of registration
	 */
	status: text("status").notNull().default(MentorStatus.PENDING),

	/**
	 * On-chain registration tracking
	 */
	transactionHash: text("transaction_hash"),

	/**
	 * Block number when the transaction was mined
	 */
	blockNumber: integer("block_number"),

	/**
	 * On-chain registration timestamp
	 */
	registeredAt: integer("registered_at", { mode: "timestamp" }),

	/**
	 * Audit fields
	 */
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),

	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

// Export types
export type Mentor = typeof mentors.$inferSelect;
export type NewMentor = typeof mentors.$inferInsert;
