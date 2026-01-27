import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { domain as baseDomain, mentorRegisterTypes } from "@/lib/constants";
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
				const errorMsg = "Wallet not connected. Please connect your wallet.";
				setError(errorMsg);
				toast.error(errorMsg);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const { username, mentorAddress } = params;

				if (mentorAddress.toLowerCase() !== userAddress.toLowerCase()) {
					throw new Error(
						"Mentor address must match your connected wallet address",
					);
				}

				const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);

				toast.info("Checking network status and nonce...");

				const nonce = await publicClient.readContract({
					address: MENTOR_REGISTRY_ADDRESS,
					abi: MENTOR_REGISTRY_ABI,
					functionName: "getNonce",
					args: [userAddress],
				});

				const domain = {
					...baseDomain,
					chainId: chainId,
				};

				const message = {
					username,
					creatorAddress: mentorAddress,
					nonce: nonce as bigint,
					deadline,
				};

				toast.info("Signature request sent to your wallet...");

				const signature = await signTypedData(config, {
					domain,
					types: mentorRegisterTypes,
					primaryType: "MentorRegister",
					message,
				});

				toast.success("Signature received");

				const data = encodeFunctionData({
					abi: MENTOR_REGISTRY_ABI,
					functionName: "registerMentorByRelayer",
					args: [username, mentorAddress, deadline, signature],
				});

				toast.info("Sending transaction to relayer...");

				const submitRes = await fetch("/api/mentor/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						data,
						username,
						mentorAddress,
					}),
				});

				const result = await submitRes.json();

				if (!submitRes.ok) {
					throw new Error(
						result?.error || "Relayer failed to submit transaction",
					);
				}

				toast.success("Registration successful!");

				if (result.id) {
					nav({ to: `/mentor/registered?tx=${result.id}` });
				}
			} catch (err: any) {
				const errorMessage = err?.message || "An unexpected error occurred";
				setError(errorMessage);
				toast.error(errorMessage);
				console.error("Registration error:", err);
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
