import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schemas.js";

const databaseUrl = process.env.DATABASE_URL || "file:./db/local.db";

console.log("🌱 Seeding demo mentor data...");

const sqlite = createClient({
	url: databaseUrl,
});

const db = drizzle(sqlite, { schema });

async function seedDemoMentor() {
	try {
		// Check if demo mentor already exists
		const existing = await db
			.select()
			.from(schema.mentors)
			.where(eq(schema.mentors.username, "sample_mentor"))
			.limit(1);

		if (existing.length > 0) {
			console.log("✅ Demo mentor already exists!");
			return;
		}

		// Insert demo mentor
		const [mentor] = await db
			.insert(schema.mentors)
			.values({
				walletAddress: "0x742d35Cc6634C0532925a3b8D40a8f0a00000001",
				fullName: "Alex Johnson",
				username: "sample_mentor",
				bio:
					"I'm a seasoned blockchain developer with 8+ years of experience in Web3, DeFi, and smart contract development. I've helped over 500 students learn blockchain technology and land roles at top companies. My expertise includes Solidity, Rust, Ethereum, Solana, and building scalable dApps. I offer 1-on-1 mentorship sessions where we dive deep into blockchain concepts, review code, prepare for technical interviews, and build real-world projects together. Whether you're a beginner or looking to advance your career, I'll provide personalized guidance based on your goals.",
				status: "registered",
				transactionHash: "0x" + "a".repeat(64),
				blockNumber: 12345678,
				registeredAt: new Date(),
			})
			.returning();

		console.log("✅ Demo mentor created successfully!");
		console.log("\n📊 Mentor Details:");
		console.log(`   Username: ${mentor.username}`);
		console.log(`   Name: ${mentor.fullName}`);
		console.log(`   Bio: ${mentor.bio.substring(0, 100)}...`);
		console.log(`   Status: ${mentor.status}`);
		console.log("\n🌐 You can view this profile at:");
		console.log("   http://localhost:3000/mentor/profile/sample_mentor");
	} catch (error) {
		console.error("❌ Error seeding demo mentor:", error);
		process.exit(1);
	} finally {
		sqlite.close();
	}
}

seedDemoMentor();
