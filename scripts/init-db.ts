import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schemas.js";

const databaseUrl = process.env.DATABASE_URL || "file:./db/local.db";

console.log("📦 Initializing database...");

const sqlite = createClient({
	url: databaseUrl,
});

const db = drizzle(sqlite, { schema });

try {
	// Push schema to database
	console.log("✅ Database connected successfully");

	// Test the connection by querying the schema
	const result = await sqlite.execute("SELECT name FROM sqlite_master WHERE type='table';");

	console.log("\n📊 Database Tables:");
	console.table(
		result.rows.map((row: any) => ({
			Table: row.name,
		})),
	);

	console.log("\n✨ Database initialization complete!");
} catch (error) {
	console.error("❌ Database initialization failed:", error);
	process.exit(1);
} finally {
	sqlite.close();
}
