import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
	getMentorByUsername,
	getMentorByWalletAddress,
	isUsernameAvailable,
	isWalletAddressAvailable,
	registerMentorInDB,
	updateMentorOnChainStatus,
	validateUsername,
	validateWalletAddress,
} from "./mentor.server";

/**
 * Zod schema for mentor registration data
 */
const MentorRegistrationSchema = z.object({
	walletAddress: z.string().refine(validateWalletAddress, {
		message: "Invalid wallet address format",
	}),
	fullName: z.string().min(1, "Full name is required"),
	username: z.string().refine(validateUsername, {
		message:
			"Username must be 3-20 characters, alphanumeric and underscores only",
	}),
	bio: z.string().min(1, "Bio is required"),
});

/**
 * Zod schema for update mentor status data
 */
const _UpdateMentorStatusSchema = z.object({
	username: z.string().min(1),
	transactionHash: z.string(),
	blockNumber: z.number(),
});

/**
 * Zod schema for get mentor data
 */
const GetMentorSchema = z.object({
	username: z.string().min(1),
});

/**
 * Zod schema for get mentor by wallet data
 */
const GetMentorByWalletSchema = z.object({
	walletAddress: z.string().refine(validateWalletAddress, {
		message: "Invalid wallet address format",
	}),
});

/**
 * Zod schema for check username availability
 */
const CheckUsernameSchema = z.object({
	username: z.string().refine(validateUsername, {
		message:
			"Username must be 3-20 characters, alphanumeric and underscores only",
	}),
});

/**
 * Zod schema for check wallet availability
 */
const CheckWalletSchema = z.object({
	walletAddress: z.string().refine(validateWalletAddress, {
		message: "Invalid wallet address format",
	}),
});

// Server Functions

/**
 * Register a mentor via relayer
 */
export const registerMentorViaRelayer = createServerFn({ method: "POST" })
	.inputValidator(MentorRegistrationSchema)
	.handler(async ({ data }) => {
		// First, register in DB
		const mentor = await registerMentorInDB(data);

		// The actual on-chain registration will be handled via Wagmi hooks
		// This service focuses on database operations

		// For now, we'll create a mock transaction hash
		// In production, this would be returned after successful on-chain registration
		const transactionHash = `0x${Math.random().toString(16).padStart(64, "0")}`;

		// Update mentor status to registered
		await updateMentorOnChainStatus(
			data.username,
			transactionHash,
			0, // Block number would be populated after confirmation
		);

		return {
			mentor,
			transactionHash,
		};
	});

/**
 * Get mentor by username
 */
export const getMentor = createServerFn({ method: "GET" })
	.inputValidator(GetMentorSchema)
	.handler(async ({ data }) => {
		return await getMentorByUsername(data.username);
	});

/**
 * Get mentor by wallet address
 */
export const getMentorByWallet = createServerFn({ method: "GET" })
	.inputValidator(GetMentorByWalletSchema)
	.handler(async ({ data }) => {
		return await getMentorByWalletAddress(data.walletAddress);
	});

/**
 * Check if username is available
 */
export const checkUsernameAvailability = createServerFn({ method: "GET" })
	.inputValidator(CheckUsernameSchema)
	.handler(async ({ data }) => {
		return await isUsernameAvailable(data.username);
	});

/**
 * Check if wallet address is available
 */
export const checkWalletAvailability = createServerFn({ method: "GET" })
	.inputValidator(CheckWalletSchema)
	.handler(async ({ data }) => {
		return await isWalletAddressAvailable(data.walletAddress);
	});
