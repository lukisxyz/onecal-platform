import { eq } from "drizzle-orm";
import { db } from "@/db/index.js";
import type { NewMentor } from "@/db/schemas.js";
import { MentorStatus, mentors } from "@/db/schemas.js";

/**
 * Type definition for mentor registration
 */
export interface MentorRegistrationData {
	walletAddress: string;
	fullName: string;
	username: string;
	bio: string;
}

/**
 * Validate username format
 */
export function validateUsername(username: string): boolean {
	// Username must be 3-20 characters, alphanumeric and underscores only
	const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
	return usernameRegex.test(username);
}

/**
 * Validate wallet address format
 */
export function validateWalletAddress(address: string): boolean {
	return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Register a mentor in the database
 */
export async function registerMentorInDB(
	data: MentorRegistrationData,
): Promise<NewMentor> {
	// Check if wallet address already exists
	const existingMentorByWallet = await db
		.select()
		.from(mentors)
		.where(eq(mentors.walletAddress, data.walletAddress.toLowerCase()))
		.limit(1);

	if (existingMentorByWallet.length > 0) {
		throw new Error("Wallet address already registered");
	}

	// Check if username already exists
	const existingMentorByUsername = await db
		.select()
		.from(mentors)
		.where(eq(mentors.username, data.username))
		.limit(1);

	if (existingMentorByUsername.length > 0) {
		throw new Error("Username already taken");
	}

	// Insert into database
	const [mentor] = await db
		.insert(mentors)
		.values({
			walletAddress: data.walletAddress.toLowerCase(),
			fullName: data.fullName,
			username: data.username,
			bio: data.bio,
			status: MentorStatus.PENDING,
		})
		.returning();

	return mentor;
}

/**
 * Update mentor status after on-chain registration
 */
export async function updateMentorOnChainStatus(
	username: string,
	transactionHash: string,
	blockNumber: number,
): Promise<void> {
	await db
		.update(mentors)
		.set({
			status: MentorStatus.REGISTERED,
			transactionHash,
			blockNumber,
			registeredAt: new Date(),
		})
		.where(eq(mentors.username, username));
}

/**
 * Get mentor by username
 */
export async function getMentorByUsername(
	username: string,
): Promise<NewMentor | null> {
	const result = await db
		.select()
		.from(mentors)
		.where(eq(mentors.username, username))
		.limit(1);

	return result[0] || null;
}

/**
 * Get mentor by wallet address
 */
export async function getMentorByWalletAddress(
	walletAddress: string,
): Promise<NewMentor | null> {
	const result = await db
		.select()
		.from(mentors)
		.where(eq(mentors.walletAddress, walletAddress.toLowerCase()))
		.limit(1);

	return result[0] || null;
}

/**
 * Check if username is available (not registered in DB)
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
	const result = await db
		.select({ id: mentors.id })
		.from(mentors)
		.where(eq(mentors.username, username))
		.limit(1);

	return result.length === 0;
}

/**
 * Check if wallet address is available
 */
export async function isWalletAddressAvailable(
	walletAddress: string,
): Promise<boolean> {
	const result = await db
		.select({ id: mentors.id })
		.from(mentors)
		.where(eq(mentors.walletAddress, walletAddress.toLowerCase()))
		.limit(1);

	return result.length === 0;
}
