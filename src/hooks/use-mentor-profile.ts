import { useQuery } from "@tanstack/react-query";

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

interface UseMentorProfileResult {
	data: MentorProfile | null;
	isLoading: boolean;
	error: Error | null;
}

export function useMentorProfile(walletAddress: string | undefined): UseMentorProfileResult {
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
	};
}
