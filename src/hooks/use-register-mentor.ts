import { useNavigate } from "@tanstack/react-router";
import { signTypedData } from "@wagmi/core";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { MENTOR_REGISTRY_ABI, MENTOR_REGISTRY_ADDRESS } from "@/contracts";
import { domain as baseDomain, mentorRegisterTypes } from "@/lib/constants";
import { config, publicClient } from "@/lib/wagmi";

type RegisterMentorParams = {
	username: string;
	mentorAddress: Address;
	fullName: string;
	bio?: string;
	timezone: string;
};

type HookReturn = {
	isLoading: boolean;
	error: string | null;
	registerMentor: (params: RegisterMentorParams) => Promise<void>;
};

// Validate username format: snake_case (lowercase + underscores) + alphanumeric only
function validateUsername(username: string): {
	isValid: boolean;
	error?: string;
} {
	if (!username || username.length === 0) {
		return { isValid: false, error: "Username is required" };
	}

	// Check if only contains lowercase letters, numbers, and underscores
	const snakeCaseRegex = /^[a-z0-9_]+$/;

	if (!snakeCaseRegex.test(username)) {
		return {
			isValid: false,
			error:
				"Username must be snake_case (lowercase) and contain only letters (a-z), numbers (0-9), and underscores (_)",
		};
	}

	return { isValid: true };
}

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
				const { username, mentorAddress, fullName, bio, timezone } = params;

				if (mentorAddress.toLowerCase() !== userAddress.toLowerCase()) {
					throw new Error(
						"Mentor address must match your connected wallet address",
					);
				}

				// Step 1: Validate username format
				toast.info("Validating username format...");
				const validation = validateUsername(username);

				if (!validation.isValid) {
					setError(validation.error || "Invalid username format");
					toast.error(validation.error || "Invalid username format");
					return;
				}

				// Step 2: Check if username exists
				toast.info("Checking username availability...");
				const usernameExists = await publicClient.readContract({
					address: MENTOR_REGISTRY_ADDRESS,
					abi: MENTOR_REGISTRY_ABI,
					functionName: "usernameExists",
					args: [username],
				});

				if (usernameExists) {
					// Username exists - check if it belongs to this wallet
					toast.info("Username already exists. Checking wallet address...");
					const existingMentor = await publicClient.readContract({
						address: MENTOR_REGISTRY_ADDRESS,
						abi: MENTOR_REGISTRY_ABI,
						functionName: "getMentor",
						args: [username],
					});

					const [, existingAddress, exists] = existingMentor as [
						string,
						Address,
						boolean,
					];

					if (
						exists &&
						existingAddress.toLowerCase() === userAddress.toLowerCase()
					) {
						// Same wallet - redirect to dashboard after delay
						toast.info(
							"You are already registered with this username. Redirecting to dashboard in 3 seconds...",
						);
						setTimeout(() => {
							nav({ to: "/mentor/dashboard" });
						}, 3000);
						return;
					} else {
						// Different wallet - show error
						const errorMsg =
							"Username already taken by another wallet. Please use a different username.";
						setError(errorMsg);
						toast.error(errorMsg);
						return;
					}
				}

				// Step 3: Username doesn't exist - check if wallet is already registered
				toast.info(
					"Username available. Checking wallet registration status...",
				);
				const walletRegistration = await publicClient.readContract({
					address: MENTOR_REGISTRY_ADDRESS,
					abi: MENTOR_REGISTRY_ABI,
					functionName: "getMentorByAddress",
					args: [userAddress],
				});

				const [, , walletExists] = walletRegistration as [
					string,
					Address,
					boolean,
				];

				if (walletExists) {
					// Wallet is already registered with a different username
					toast.info(
						"This wallet is already registered with a different username. Redirecting to dashboard in 3 seconds...",
					);
					setTimeout(() => {
						nav({ to: "/mentor/dashboard" });
					}, 3000);
					return;
				}

				// Step 4: Proceed with registration
				toast.success("Username available. Proceeding with registration...");
				toast.info("Checking network status and nonce...");

				const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);

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
						walletAddress: mentorAddress,
						fullName,
						bio,
						timezone,
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
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error ? err.message : "An unexpected error occurred";
				setError(errorMessage);
				toast.error(errorMessage);
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
