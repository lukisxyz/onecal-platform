import { useQuery, useQueryClient } from "@tanstack/react-query";

type TransactionStatus = {
	id: string;
	transactionId: string;
	hash: string | null;
	status: string;
	createdAt: Date | null;
	sentAt: Date | null;
	confirmedAt: Date | null;
	gasPrice: string | null;
	gasLimit: number | null;
	nonce: number | null;
	value: string | null;
	from: string | null;
	to: string | null;
	relayerId: string | null;
	data: string | null;
	maxFeePerGas: string | null;
	maxPriorityFeePerGas: string | null;
	speed: string | null;
	statusReason: string | null;
	eventTimestamp: Date;
};

type TransactionStatusResponse = {
	success: boolean;
	latest: TransactionStatus | null;
	history: TransactionStatus[];
	count: number;
};

export function useTransactionStatus(hash: string | null, options?: { refetchInterval?: number }) {
	const queryClient = useQueryClient();

	const query = useQuery<TransactionStatusResponse>({
		queryKey: ["transaction-status", hash],
		queryFn: async () => {
			if (!hash) {
				return {
					success: true,
					latest: null,
					history: [],
					count: 0,
				};
			}

			const response = await fetch(`/api/transaction/status?hash=${hash}`);
			if (!response.ok) {
				throw new Error("Failed to fetch transaction status");
			}
			const data = await response.json();

			// Transform ISO strings back to Date objects
			const transformStatus = (status: any) => ({
				...status,
				createdAt: status.createdAt ? new Date(status.createdAt) : null,
				sentAt: status.sentAt ? new Date(status.sentAt) : null,
				confirmedAt: status.confirmedAt ? new Date(status.confirmedAt) : null,
				eventTimestamp: status.eventTimestamp ? new Date(status.eventTimestamp) : null,
			});

			return {
				...data,
				latest: data.latest ? transformStatus(data.latest) : null,
				history: data.history.map(transformStatus),
			};
		},
		enabled: !!hash,
		staleTime: 1000 * 60, // Consider data stale after 1 minute
		gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
		refetchInterval: options?.refetchInterval ?? false,
	});

	return {
		...query,
		// Helper function to manually refresh
		refresh: () => queryClient.invalidateQueries({ queryKey: ["transaction-status", hash] }),
	};
}

// Helper hook for transaction by ID
export function useTransactionStatusById(transactionId: string | null, options?: { refetchInterval?: number }) {
	const queryClient = useQueryClient();

	const query = useQuery<TransactionStatusResponse>({
		queryKey: ["transaction-status-by-id", transactionId],
		queryFn: async () => {
			if (!transactionId) {
				return {
					success: true,
					latest: null,
					history: [],
					count: 0,
				};
			}

			const response = await fetch(`/api/transaction/status?transactionId=${transactionId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch transaction status");
			}
			const data = await response.json();

			// Transform ISO strings back to Date objects
			const transformStatus = (status: any) => ({
				...status,
				createdAt: status.createdAt ? new Date(status.createdAt) : null,
				sentAt: status.sentAt ? new Date(status.sentAt) : null,
				confirmedAt: status.confirmedAt ? new Date(status.confirmedAt) : null,
				eventTimestamp: status.eventTimestamp ? new Date(status.eventTimestamp) : null,
			});

			return {
				...data,
				latest: data.latest ? transformStatus(data.latest) : null,
				history: data.history.map(transformStatus),
			};
		},
		enabled: !!transactionId,
		staleTime: 1000 * 60,
		gcTime: 1000 * 60 * 5,
		refetchInterval: options?.refetchInterval ?? false,
	});

	return {
		...query,
		refresh: () => queryClient.invalidateQueries({ queryKey: ["transaction-status-by-id", transactionId] }),
	};
}
