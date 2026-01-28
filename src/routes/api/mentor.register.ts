import {
	type ApiResponseTransactionResponseData,
	type EvmTransactionResponse,
	type NetworkTransactionRequest,
	Speed,
} from "@openzeppelin/relayer-sdk";
import { createFileRoute } from "@tanstack/react-router";
import { MENTOR_REGISTRY_ADDRESS } from "@/contracts";
import {
	createMentorProfile,
	getMentorProfile,
	updateMentorProfile,
} from "@/lib/mentor-profile.server";
import { relayerId, relayersApi } from "@/lib/relayer.server";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Route = createFileRoute("/api/mentor/register")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const { data, username, walletAddress, fullName, bio, timezone } =
						await request.json();

					const networkTransaction: NetworkTransactionRequest = {
						to: MENTOR_REGISTRY_ADDRESS,
						data,
						speed: Speed.FAST,
						gas_limit: 300_000,
						value: 0,
					};

					const sendTxRes = await relayersApi.sendTransaction(
						relayerId,
						networkTransaction,
					);

					const { id: txId } = sendTxRes.data
						.data as ApiResponseTransactionResponseData;
					let hash: string | null = null;
					let resData: ApiResponseTransactionResponseData | null = null;

					for (let attempt = 0; attempt < 3; attempt++) {
						const txStatusRes = await relayersApi.getTransactionById(
							relayerId,
							txId,
						);
						const txData = txStatusRes.data.data as EvmTransactionResponse;

						if (txData.hash) {
							hash = txData.hash;
							resData = txData;
							break;
						}

						await delay(1000 * 2 ** attempt);
					}

					if (!resData) {
						const finalTxRes = await relayersApi.getTransactionById(
							relayerId,
							txId,
						);
						resData = finalTxRes.data
							.data as ApiResponseTransactionResponseData;
					}

					const { status, confirmed_at, created_at } = resData;

					// Save or update mentor profile data in database
					let profileCreated = false;
					if (username && walletAddress && fullName && timezone) {
						const existingProfile = await getMentorProfile(
							walletAddress,
							username,
						);

						if (existingProfile) {
							// Update existing profile
							await updateMentorProfile(walletAddress, username, {
								fullName,
								bio,
								timezone,
							});
							profileCreated = false;
						} else {
							// Create new profile
							await createMentorProfile({
								username,
								walletAddress,
								fullName,
								bio,
								timezone,
							});
							profileCreated = true;
						}
					}

					return Response.json({
						id: hash,
						txId,
						status,
						confirmed_at,
						created_at,
						profileCreated,
					});
				} catch (err: unknown) {
					// Try to extract meaningful error message
					let errorMessage = "Failed to register mentor";

					if (err instanceof Error) {
						// Check for common custom errors
						if (
							err.message.includes("AddressAlreadyExists") ||
							err.message.includes("0x8baa579f")
						) {
							errorMessage = "This mentor address is already registered";
						} else if (err.message.includes("UsernameAlreadyExists")) {
							errorMessage = "This username is already taken";
						} else if (err.message.includes("DeadlineExceeded")) {
							errorMessage = "Transaction deadline exceeded. Please try again";
						} else if (err.message.includes("InvalidSignature")) {
							errorMessage = "Invalid signature. Please try again";
						} else if (err.message) {
							errorMessage = err.message;
						}
					}

					return new Response(JSON.stringify({ error: errorMessage }), {
						status: 500,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
		},
	},
});
