import "dotenv/config";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Get database path from env or use default
const dbPath = (process.env.DATABASE_URL || "file:./db/local.db").replace("file:", "");
const dbDir = path.dirname(dbPath);

console.log("=".repeat(60));
console.log("DATABASE STATUS");
console.log("=".repeat(60));

// Check if database exists
if (!fs.existsSync(dbDir)) {
	console.log("\n❌ Database directory does not exist");
	console.log(`   Path: ${dbDir}`);
	console.log("\n💡 Run: npm run db:init");
	process.exit(1);
}

const dbFile = dbPath.replace("file:", "");

if (!fs.existsSync(dbFile)) {
	console.log("\n❌ Database file does not exist");
	console.log(`   Path: ${dbFile}`);
	console.log("\n💡 Run: npm run db:init");
	process.exit(1);
}

// Get database stats
const stats = fs.statSync(dbFile);
const sizeInMB = stats.size / (1024 * 1024);

console.log("\n✅ Database exists");
console.log(`   Path: ${dbFile}`);
console.log(`   Size: ${sizeInMB.toFixed(2)} MB`);
console.log(`   Modified: ${stats.mtime.toLocaleString()}`);

// Connect and check table
try {
	const sqlite = new Database(dbPath, { readonly: true });

	// Check if table exists
	const tableExists = sqlite
		.prepare(
			"SELECT name FROM sqlite_master WHERE type='table' AND name='transaction_statuses'",
		)
		.get();

	if (tableExists) {
		console.log("\n✅ transaction_statuses table exists");

		// Count records
		const count = sqlite
			.prepare("SELECT COUNT(*) as count FROM transaction_statuses")
			.get() as { count: number };

		console.log(`   Records: ${count.count}`);

		// Get latest record
		const latest = sqlite
			.prepare(
				"SELECT * FROM transaction_statuses ORDER BY event_timestamp DESC LIMIT 1",
			)
			.get();

		if (latest) {
			console.log(
				`   Latest: ${new Date((latest as any).event_timestamp * 1000).toLocaleString()}`,
			);
		}

		// Check indexes
		const indexes = sqlite
			.prepare(
				"SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='transaction_statuses'",
			)
			.all() as { name: string }[];

		console.log(`   Indexes: ${indexes.length}`);
		indexes.forEach((idx) => {
			console.log(`      - ${idx.name}`);
		});
	} else {
		console.log("\n⚠️  transaction_statuses table does not exist");
		console.log("\n💡 Run: npm run db:init");
	}

	sqlite.close();
} catch (err) {
	console.error("\n❌ Error accessing database:", err);
	process.exit(1);
}

console.log("\n" + "=".repeat(60));
console.log("\n📚 Available commands:");
console.log("   npm run db:init    - Initialize database");
console.log("   npm run db:reset  - Reset database (delete and reinit)");
console.log("   npm run db:status - Check database status");
console.log("\n" + "=".repeat(60));
