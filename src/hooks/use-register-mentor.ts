import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import {
	domain,
	type MentorRegister,
	mentorRegisterTypes,
} from "@/lib/constants";
import { MENTOR_REGISTRY_ADDRESS, MENTOR_REGISTRY_ABI } from "@/contracts";
import { signTypedData } from "@wagmi/core";
import { config, publicClient } from "@/lib/wagmi";

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

			setIsLoading(true);
			setError(null);

			try {
				const { username, mentorAddress } = params;

				if (mentorAddress !== userAddress) {
					const errorMsg =
						"Mentor address must match your connected wallet address";
					setError(errorMsg);
					toast.error(errorMsg);
					throw new Error(errorMsg);
				}

				const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);

				toast.info("Getting nonce...");

				// 1. Get nonce from mentor registry
				const nonce = await publicClient.readContract({
					address: MENTOR_REGISTRY_ADDRESS,
					abi: MENTOR_REGISTRY_ABI,
					functionName: "getNonce",
					args: [userAddress],
				});

				toast.success("Nonce retrieved");

				const signed: MentorRegister = {
					username,
					creatorAddress: mentorAddress,
					nonce: nonce as bigint,
					deadline,
				};

				toast.info("Please sign the transaction in your wallet...");

				const signature = await signTypedData(config, {
					domain,
					types: mentorRegisterTypes,
					primaryType: "MentorRegister",
					message: signed,
				});

				toast.success("Transaction signed");

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
						deadline,
						v,
						r as `0x${string}`,
						s as `0x${string}`,
					],
				});

				toast.info("Submitting registration...");

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
					const err = await submitRes.json();
					throw new Error(err?.error || "Transaction submission failed");
				}

				const result = await submitRes.json();

				toast.success("Registration submitted successfully!");

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
