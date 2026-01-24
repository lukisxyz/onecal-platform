import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas.js";

const databaseUrl = process.env.DATABASE_URL || "file:./db/local.db";
const isTurso = databaseUrl.startsWith("libsql://");

const sqlite = createClient({
	url: databaseUrl,
	authToken: isTurso ? process.env.TURSO_AUTH_TOKEN : undefined,
});

const db = drizzle(sqlite, { schema });

if (isTurso) {
	console.log("🔗 Connected to Turso database");
} else {
	console.log("🗄️ Connected to local SQLite database");
}

export { db, sqlite };
export * from "./index.js";
