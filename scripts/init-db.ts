import "dotenv/config";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Get database path from env or use default
const dbPath = (process.env.DATABASE_URL || "file:./db/local.db").replace("file:", "");
const dbDir = path.dirname(dbPath);

console.log("Initializing database...");
console.log(`Database path: ${dbPath}`);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
	console.log(`Creating directory: ${dbDir}`);
	fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrency
console.log("Setting WAL mode...");
sqlite.pragma("journal_mode = WAL");

// Run migrations - create tables and indexes
async function runMigrations() {
	console.log("Creating transaction_statuses table...");

	// Create the table
	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS transaction_statuses (
			id TEXT PRIMARY KEY,
			transaction_id TEXT NOT NULL,
			hash TEXT,
			status TEXT NOT NULL,
			created_at INTEGER,
			sent_at INTEGER,
			confirmed_at INTEGER,
			gas_price TEXT,
			gas_limit INTEGER,
			nonce INTEGER,
			value TEXT,
			from_address TEXT,
			to_address TEXT,
			relayer_id TEXT,
			data TEXT,
			max_fee_per_gas TEXT,
			max_priority_fee_per_gas TEXT,
			speed TEXT,
			status_reason TEXT,
			event_timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
		);
	`);

	console.log("Creating indexes...");

	// Create indexes for faster queries
	const indexes = [
		"CREATE INDEX IF NOT EXISTS idx_transaction_statuses_transaction_id ON transaction_statuses(transaction_id)",
		"CREATE INDEX IF NOT EXISTS idx_transaction_statuses_hash ON transaction_statuses(hash)",
		"CREATE INDEX IF NOT EXISTS idx_transaction_statuses_status ON transaction_statuses(status)",
		"CREATE INDEX IF NOT EXISTS idx_transaction_statuses_event_timestamp ON transaction_statuses(event_timestamp)",
	];

	indexes.forEach((query) => {
		console.log(`  - ${query.split(" ")[5]}`);
		sqlite.exec(query);
	});

	console.log("\n✅ Database initialized successfully!");
	console.log(`Database location: ${dbPath}`);
}

// Run migrations
runMigrations()
	.then(() => {
		sqlite.close();
		process.exit(0);
	})
	.catch((err) => {
		console.error("❌ Database initialization failed:", err);
		sqlite.close();
		process.exit(1);
	});
