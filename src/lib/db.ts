import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schemas from "@/db/schemas";
import fs from "fs";
import path from "path";

// Ensure database directory exists
const dbPath = (process.env.DATABASE_URL || "file:./db/local.db").replace("file:", "");
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrency
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, {
	schema: schemas,
});

export { sqlite };

