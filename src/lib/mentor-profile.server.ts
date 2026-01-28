import { db } from "./db";
import { mentorProfiles } from "@/db/schemas";
import { eq, and, isNull } from "drizzle-orm";

export interface CreateMentorProfileData {
	username: string;
	walletAddress: string;
	fullName: string;
	bio?: string;
	timezone: string;
}

export interface UpdateMentorProfileData {
	fullName: string;
	bio?: string;
	timezone: string;
}

/**
 * Create a new mentor profile
 */
export async function createMentorProfile(data: CreateMentorProfileData) {
	const result = await db
		.insert(mentorProfiles)
		.values({
			username: data.username,
			walletAddress: data.walletAddress,
			fullName: data.fullName,
			bio: data.bio,
			timezone: data.timezone,
		})
		.returning();

	return result[0];
}

/**
 * Update an existing mentor profile
 */
export async function updateMentorProfile(
	walletAddress: string,
	username: string,
	data: UpdateMentorProfileData
) {
	const result = await db
		.update(mentorProfiles)
		.set({
			fullName: data.fullName,
			bio: data.bio,
			timezone: data.timezone,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(mentorProfiles.walletAddress, walletAddress),
				eq(mentorProfiles.username, username),
				isNull(mentorProfiles.deletedAt)
			)
		)
		.returning();

	return result[0];
}

/**
 * Get mentor profile by wallet address and username
 */
export async function getMentorProfile(walletAddress: string, username: string) {
	const result = await db
		.select()
		.from(mentorProfiles)
		.where(
			and(
				eq(mentorProfiles.walletAddress, walletAddress),
				eq(mentorProfiles.username, username),
				isNull(mentorProfiles.deletedAt)
			)
		)
		.limit(1);

	return result[0] || null;
}

/**
 * Get mentor profile by wallet address only
 */
export async function getMentorProfileByWallet(walletAddress: string) {
	const result = await db
		.select()
		.from(mentorProfiles)
		.where(
			and(
				eq(mentorProfiles.walletAddress, walletAddress),
				isNull(mentorProfiles.deletedAt)
			)
		)
		.limit(1);

	return result[0] || null;
}

/**
 * Soft delete a mentor profile
 */
export async function softDeleteMentorProfile(walletAddress: string, username: string) {
	const result = await db
		.update(mentorProfiles)
		.set({
			deletedAt: new Date(),
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(mentorProfiles.walletAddress, walletAddress),
				eq(mentorProfiles.username, username),
				isNull(mentorProfiles.deletedAt)
			)
		)
		.returning();

	return result[0] || null;
}