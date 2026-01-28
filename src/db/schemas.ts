import { sql } from "drizzle-orm";
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

// Transaction status updates from webhooks
export const transactionStatuses = pgTable(
	"transaction_statuses",
	{
		id: text("id").primaryKey(), // webhook event id
		transactionId: text("transaction_id").notNull(), // transaction id from relayer
		hash: text("hash"), // transaction hash
		status: text("status").notNull(), // sent, submitted, confirmed, failed
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		sentAt: timestamp("sent_at", { withTimezone: true }),
		confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
		gasPrice: text("gas_price"),
		gasLimit: integer("gas_limit"),
		nonce: integer("nonce"),
		value: text("value"),
		from: text("from_address"),
		to: text("to_address"),
		relayerId: text("relayer_id"),
		data: text("data"),
		maxFeePerGas: text("max_fee_per_gas"),
		maxPriorityFeePerGas: text("max_priority_fee_per_gas"),
		speed: text("speed"),
		statusReason: text("status_reason"),
		eventTimestamp: timestamp("event_timestamp", { withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => {
		return {
			transactionIdIdx: index("idx_transaction_statuses_transaction_id").on(
				table.transactionId,
			),
			hashIdx: index("idx_transaction_statuses_hash").on(table.hash),
			statusIdx: index("idx_transaction_statuses_status").on(table.status),
		};
	},
);

// Mentor profiles stored off-chain (full name, bio, timezone)
export const mentorProfiles = pgTable(
	"mentor_profiles",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		username: varchar("username", { length: 50 }).notNull(),
		walletAddress: varchar("wallet_address", { length: 66 }).notNull(),
		fullName: varchar("full_name", { length: 255 }).notNull(),
		bio: text("bio"),
		timezone: varchar("timezone", { length: 100 }).notNull(),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => {
		return {
			usernameIdx: index("idx_mentor_profiles_username").on(table.username),
			walletAddressIdx: index("idx_mentor_profiles_wallet_address").on(
				table.walletAddress,
			),
			usernameActiveIdx: index("idx_mentor_profiles_username_active")
				.on(table.username)
				.where(sql`${table.deletedAt} IS NULL`),
			walletAddressActiveIdx: index("idx_mentor_profiles_wallet_address_active")
				.on(table.walletAddress)
				.where(sql`${table.deletedAt} IS NULL`),
		};
	},
);
