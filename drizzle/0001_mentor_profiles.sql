CREATE TABLE "mentor_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) UNIQUE NOT NULL,
	"wallet_address" varchar(66) UNIQUE NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"bio" text,
	"timezone" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_mentor_profiles_username" ON "mentor_profiles" USING btree ("username");
--> statement-breakpoint
CREATE INDEX "idx_mentor_profiles_wallet_address" ON "mentor_profiles" USING btree ("wallet_address");
--> statement-breakpoint
CREATE INDEX "idx_mentor_profiles_username_active" ON "mentor_profiles" USING btree ("username") WHERE "deleted_at" IS NULL;
--> statement-breakpoint
CREATE INDEX "idx_mentor_profiles_wallet_address_active" ON "mentor_profiles" USING btree ("wallet_address") WHERE "deleted_at" IS NULL;