import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
			transactionIdIdx: index("idx_transaction_statuses_transaction_id").on(table.transactionId),
			hashIdx: index("idx_transaction_statuses_hash").on(table.hash),
			statusIdx: index("idx_transaction_statuses_status").on(table.status),
		};
	}
);
