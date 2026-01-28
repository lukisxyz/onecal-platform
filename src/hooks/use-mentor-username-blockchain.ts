import { useQuery } from "@tanstack/react-query";
import { MENTOR_REGISTRY_ADDRESS, MENTOR_REGISTRY_ABI } from "@/contracts";
import { publicClient } from "@/lib/wagmi";

export function useMentorUsernameFromBlockchain(walletAddress: string) {
	return useQuery({
		queryKey: ["mentorUsername", walletAddress],
		queryFn: async (): Promise<{
			username: string;
			exists: boolean;
		} | null> => {
			if (!walletAddress) return null;

			try {
				const result = await publicClient.readContract({
					address: MENTOR_REGISTRY_ADDRESS,
					abi: MENTOR_REGISTRY_ABI,
					functionName: "getMentorByAddress",
					args: [walletAddress as `0x${string}`],
				});

				const [username, , exists] = result as [string, `0x${string}`, boolean];

				if (!exists) {
					return null;
				}

				return { username, exists };
			} catch (err) {
				return null;
			}
		},
		enabled: !!walletAddress,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
	});
}
