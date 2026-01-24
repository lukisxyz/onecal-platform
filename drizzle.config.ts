import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schemas.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DATABASE_URL || "file:./db/local.db",
	},
} satisfies Config;
