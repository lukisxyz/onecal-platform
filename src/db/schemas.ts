import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Transaction status updates from webhooks
export const transactionStatuses = sqliteTable("transaction_statuses", {
	id: text("id").primaryKey(), // webhook event id
	transactionId: text("transaction_id").notNull(), // transaction id from relayer
	hash: text("hash"), // transaction hash
	status: text("status").notNull(), // sent, submitted, confirmed, failed
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	sentAt: integer("sent_at", { mode: "timestamp" }),
	confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
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
	eventTimestamp: integer("event_timestamp", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

// Indexes for faster queries
export const transactionStatusesIndexes = {
	transactionIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_transaction_statuses_transaction_id ON ${transactionStatuses}(transaction_id)`,
	hashIdx: sql`CREATE INDEX IF NOT EXISTS idx_transaction_statuses_hash ON ${transactionStatuses}(hash)`,
	statusIdx: sql`CREATE INDEX IF NOT EXISTS idx_transaction_statuses_status ON ${transactionStatuses}(status)`,
};
