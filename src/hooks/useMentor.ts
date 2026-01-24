/**
 * Custom hook for mentor-related operations using TanStack Query
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
export interface MentorRegistrationData {
	walletAddress: string;
	fullName: string;
	username: string;
	bio: string;
}

export interface Mentor {
	id: number;
	walletAddress: string;
	fullName: string;
	username: string;
	bio: string;
	status: "pending" | "registered" | "rejected";
	transactionHash?: string;
	blockNumber?: number;
	registeredAt?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Query key factory for mentor queries
 */
export const mentorKeys = {
	all: ["mentors"] as const,
	lists: () => [...mentorKeys.all, "list"] as const,
	list: (filters: string) => [...mentorKeys.lists(), { filters }] as const,
	details: () => [...mentorKeys.all, "detail"] as const,
	detail: (username: string) => [...mentorKeys.details(), username] as const,
	byWallet: (walletAddress: string) =>
		[...mentorKeys.all, "wallet", walletAddress] as const,
};

/**
 * Get mentor by username
 */
export function useMentor(username: string, enabled: boolean = true) {
	return useQuery({
		queryKey: mentorKeys.detail(username),
		enabled: enabled && !!username,
		queryFn: async () => {
			const { getMentor } = await import("@/utils/mentor.functions");
			const result = await getMentor({ data: { username } });
			return result as Mentor;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

/**
 * Get mentor by wallet address
 */
export function useMentorByWallet(
	walletAddress: string,
	enabled: boolean = true,
) {
	return useQuery({
		queryKey: mentorKeys.byWallet(walletAddress),
		enabled: enabled && !!walletAddress,
		queryFn: async () => {
			const { getMentorByWallet } = await import("@/utils/mentor.functions");
			const result = await getMentorByWallet({ data: { walletAddress } });
			return result as Mentor | null;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

/**
 * Check username availability
 */
export function useCheckUsernameAvailability() {
	return useMutation({
		mutationFn: async (username: string) => {
			const { checkUsernameAvailability } = await import(
				"@/utils/mentor.functions"
			);
			const result = await checkUsernameAvailability({ data: { username } });
			return result as boolean;
		},
		onSuccess: (isAvailable, username) => {
			if (isAvailable) {
				toast.success("Username available!", {
					description: `${username} is available to use.`,
				});
			} else {
				toast.error("Username taken", {
					description: `${username} is already taken. Please choose another.`,
				});
			}
		},
		onError: (error) => {
			toast.error("Error checking username", {
				description:
					error instanceof Error
						? error.message
						: "Failed to check availability",
			});
		},
	});
}

/**
 * Check wallet address availability
 */
export function useCheckWalletAvailability() {
	return useMutation({
		mutationFn: async (walletAddress: string) => {
			const { checkWalletAvailability } = await import(
				"@/utils/mentor.functions"
			);
			const result = await checkWalletAvailability({ data: { walletAddress } });
			return result as boolean;
		},
		onSuccess: (isAvailable, _walletAddress) => {
			if (isAvailable) {
				toast.success("Wallet address available!", {
					description: `This wallet has not been registered yet.`,
				});
			} else {
				toast.error("Wallet already registered", {
					description: "This wallet address is already registered.",
				});
			}
		},
		onError: (error) => {
			toast.error("Error checking wallet", {
				description:
					error instanceof Error
						? error.message
						: "Failed to check availability",
			});
		},
	});
}

/**
 * Register a mentor (with optimistic updates)
 */
export function useRegisterMentor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: MentorRegistrationData) => {
			const { registerMentorViaRelayer } = await import(
				"@/utils/mentor.functions"
			);
			const result = await registerMentorViaRelayer({ data });
			return result;
		},
		onMutate: (_newMentor) => {
			// Cancel outgoing refetches
			queryClient.cancelQueries({ queryKey: mentorKeys.all });

			// Snapshot previous value
			const previousMentors = queryClient.getQueriesData({
				queryKey: mentorKeys.all,
			});

			// Optimistically update to new value
			queryClient.setQueriesData({ queryKey: mentorKeys.all }, (old) => old);

			return { previousMentors };
		},
		onError: (err, _newMentor, context) => {
			// Rollback on error
			if (context?.previousMentors) {
				context.previousMentors.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}

			toast.error("Registration failed", {
				description:
					err instanceof Error
						? err.message
						: "Failed to register mentor. Please try again.",
			});
		},
		onSuccess: (data, variables) => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: mentorKeys.all });

			// Update cache with new mentor data
			queryClient.setQueryData(mentorKeys.detail(variables.username), {
				...variables,
				id: data.mentor.id,
				status: "registered",
				createdAt: data.mentor.createdAt,
				updatedAt: data.mentor.updatedAt,
			});

			toast.success("Registration successful!", {
				description: "Welcome to 0xCAL! You can now start accepting mentees.",
			});
		},
		onSettled: (_data, _error, _variables) => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: mentorKeys.all });
		},
	});
}

/**
 * Real-time validation hook for form fields
 */
export function useMentorValidation() {
	const checkUsername = useCheckUsernameAvailability();
	const checkWallet = useCheckWalletAvailability();

	const validateUsername = (username: string) => {
		if (username.length < 3) {
			toast.error("Username too short", {
				description: "Username must be at least 3 characters.",
			});
			return false;
		}
		return true;
	};

	const validateWallet = (walletAddress: string) => {
		if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
			toast.error("Invalid wallet address", {
				description: "Please enter a valid Ethereum address.",
			});
			return false;
		}
		return true;
	};

	return {
		checkUsername: (username: string) => {
			if (validateUsername(username)) {
				checkUsername.mutate(username);
			}
		},
		checkWallet: (walletAddress: string) => {
			if (validateWallet(walletAddress)) {
				checkWallet.mutate(walletAddress);
			}
		},
		isCheckingUsername: checkUsername.isPending,
		isCheckingWallet: checkWallet.isPending,
	};
}
