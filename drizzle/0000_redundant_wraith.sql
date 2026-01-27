CREATE TABLE "transaction_statuses" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text NOT NULL,
	"hash" text,
	"status" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"gas_price" text,
	"gas_limit" integer,
	"nonce" integer,
	"value" text,
	"from_address" text,
	"to_address" text,
	"relayer_id" text,
	"data" text,
	"max_fee_per_gas" text,
	"max_priority_fee_per_gas" text,
	"speed" text,
	"status_reason" text,
	"event_timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_transaction_statuses_transaction_id" ON "transaction_statuses" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "idx_transaction_statuses_hash" ON "transaction_statuses" USING btree ("hash");--> statement-breakpoint
CREATE INDEX "idx_transaction_statuses_status" ON "transaction_statuses" USING btree ("status");