import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	search?: string;
	[key: string]: string | number | undefined;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Hook for paginated queries
 */
export function usePaginatedQuery<TData = unknown>(
	url: string,
	params: PaginationParams,
	options?: Omit<
		UseQueryOptions<PaginatedResponse<TData>>,
		"queryKey" | "queryFn"
	>,
) {
	const queryKey = [url, params];

	return useQuery({
		queryKey,
		queryFn: async () => {
			const queryString = new URLSearchParams();

			// Add all params to query string
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== "") {
					queryString.append(key, String(value));
				}
			});

			const response = await fetch(`${url}?${queryString.toString()}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch: ${response.statusText}`);
			}

			return (await response.json()) as PaginatedResponse<TData>;
		},
		keepPreviousData: true,
		staleTime: 30 * 1000, // 30 seconds
		...options,
	});
}

/**
 * Hook for infinite queries
 */
export function useInfiniteQuery<TData = unknown>(
	url: string,
	getNextPageParam: (
		lastPage: PaginatedResponse<TData>,
		allPages: PaginatedResponse<TData>[],
	) => number | null,
	options?: Omit<
		UseQueryOptions<PaginatedResponse<TData>[]>,
		"queryKey" | "queryFn" | "getNextPageParam"
	>,
) {
	const queryKey = [url, "infinite"];

	return useQuery({
		queryKey,
		queryFn: async ({ pageParam = 1 }) => {
			const response = await fetch(`${url}?page=${pageParam}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch: ${response.statusText}`);
			}

			return (await response.json()) as PaginatedResponse<TData>;
		},
		getNextPageParam,
		...options,
	});
}

/**
 * Hook for cursor-based pagination
 */
export function useCursorQuery<TData = unknown>(
	url: string,
	cursor: string | null,
	options?: Omit<
		UseQueryOptions<{ data: TData[]; nextCursor: string | null }>,
		"queryKey" | "queryFn"
	>,
) {
	const queryKey = [url, "cursor", cursor];

	return useQuery({
		queryKey,
		queryFn: async () => {
			const queryString = cursor ? `?cursor=${cursor}` : "";
			const response = await fetch(`${url}${queryString}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch: ${response.statusText}`);
			}

			return (await response.json()) as {
				data: TData[];
				nextCursor: string | null;
			};
		},
		keepPreviousData: true,
		...options,
	});
}
