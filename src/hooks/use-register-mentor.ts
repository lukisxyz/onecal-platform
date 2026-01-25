import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import {
	domain,
	MENTOR_REGISTRY_ADDRESS,
	type MentorRegister,
	mentorRegisterTypes,
} from "@/lib/constants";
import { getPublicClient, getWalletClient, signTypedData } from "@wagmi/core";
import { config } from "@/lib/wagmi";
import { MENTOR_REGISTRY_ABI } from "@/contracts/MentorRegistry";

type RegisterMentorParams = {
	username: string;
	mentorAddress: Address;
};

type HookReturn = {
	isLoading: boolean;
	error: string | null;
	registerMentor: (params: RegisterMentorParams) => Promise<void>;
};

export function useRegisterMentor(): HookReturn {
	const nav = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { address: userAddress, chainId } = useAccount();

	const registerMentor = useCallback(
		async (params: RegisterMentorParams) => {
			if (!userAddress || !chainId) {
				throw new Error("Wallet not connected");
			}

			const walletClient = getWalletClient(config);

			if (!walletClient) {
				throw new Error(
					"Wallet client not available. Please ensure your wallet is connected and try again.",
				);
			}

			setIsLoading(true);
			setError(null);

			try {
				const { username, mentorAddress } = params;

				const publicClient = getPublicClient(config);

				const nonce = await publicClient?.readContract({
					address: MENTOR_REGISTRY_ADDRESS,
					abi: MENTOR_REGISTRY_ABI,
					functionName: "getNonce",
					args: [userAddress],
				});

				const signed: MentorRegister = {
					username,
					mentorAddress,
					nonce: nonce as bigint,
				};

				const signature = await signTypedData(config, {
					domain,
					types: mentorRegisterTypes,
					primaryType: "MentorRegister",
					message: signed,
				});

				const sig = signature as `0x${string}`;
				const r = sig.slice(0, 66);
				const s = `0x${sig.slice(66, 130)}`;
				const v = parseInt(sig.slice(130, 132), 16);

				const data = encodeFunctionData({
					abi: MENTOR_REGISTRY_ABI,
					functionName: "registerMentorByRelayer",
					args: [
						username,
						mentorAddress,
						BigInt(Math.floor(Date.now() / 1000) + 600),
						v,
						r as `0x${string}`,
						s as `0x${string}`,
					],
				});

				const submitRes = await fetch("/api/mentor/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						data,
						username,
						mentorAddress,
					}),
				});

				if (!submitRes.ok) {
					// Try to parse as JSON, but handle HTML error pages
					let errorMessage = "Mentor registration failed";
					try {
						const err = await submitRes.json();
						errorMessage = err?.error || errorMessage;
					} catch {
						// If response is not JSON, try to get text
						const text = await submitRes.text();
						if (text && !text.startsWith("<")) {
							errorMessage = text;
						}
					}
					throw new Error(errorMessage);
				}

				const result = await submitRes.json();

				if (!result.id) {
					throw new Error("Transaction hash missing from response");
				}

				nav({ to: `/mentor/registered?tx=${result.id}` });
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Unknown error occurred";
				setError(errorMessage);
				toast.error(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[userAddress, chainId, nav],
	);

	return {
		registerMentor,
		isLoading,
		error,
	};
}
