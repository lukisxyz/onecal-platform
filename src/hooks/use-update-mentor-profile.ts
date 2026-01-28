import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MentorProfile {
	id: string;
	username: string;
	walletAddress: string;
	fullName: string;
	bio?: string;
	timezone: string;
	createdAt: string;
	updatedAt: string;
}

interface UpdateMentorProfileData {
	fullName: string;
	bio?: string;
	timezone: string;
}

export function useMentorProfile(walletAddress: string | undefined) {
	const query = useQuery({
		queryKey: ["mentorProfile", walletAddress],
		queryFn: async (): Promise<MentorProfile> => {
			if (!walletAddress) {
				throw new Error("Wallet address is required");
			}

			const response = await fetch(`/api/mentor/${walletAddress}`);

			if (!response.ok) {
				const errorData = await response.json();
				const errorMessage = errorData.error || "Failed to fetch profile";
				throw new Error(errorMessage);
			}

			return response.json();
		},
		enabled: !!walletAddress,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
	});

	return {
		data: query.data || null,
		isLoading: query.isLoading,
		error: query.error as Error | null,
		refetch: query.refetch,
	};
}

export function useUpdateMentorProfile(
	walletAddress: string | undefined,
	username: string | undefined,
) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: UpdateMentorProfileData) => {
			if (!walletAddress || !username) {
				throw new Error("Wallet address and username are required");
			}

			const response = await fetch(`/api/mentor/${walletAddress}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					username,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				const errorMessage = errorData.error || "Failed to update profile";
				throw new Error(errorMessage);
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch the profile query
			queryClient.invalidateQueries({
				queryKey: ["mentorProfile", walletAddress],
			});
			toast.success("Profile updated successfully!");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});

	return {
		updateProfile: mutation.mutate,
		isLoading: mutation.isPending,
		error: mutation.error as Error | null,
	};
}
