import {
	type UseQueryOptions,
	type UseQueryResult,
	useQuery,
} from "@tanstack/react-query";

/**
 * Base hook for creating reusable queries
 */
export function useBaseQuery<TData, TError = Error>(
	queryKey: unknown[],
	queryFn: () => Promise<TData>,
	options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
): UseQueryResult<TData, TError> {
	return useQuery({
		queryKey,
		queryFn,
		...options,
	});
}

/**
 * Hook for creating queries with enabled condition
 */
export function useBaseQueryEnabled<TData, TError = Error>(
	queryKey: unknown[],
	queryFn: () => Promise<TData>,
	enabled: boolean,
	options?: Omit<
		UseQueryOptions<TData, TError>,
		"queryKey" | "queryFn" | "enabled"
	>,
): UseQueryResult<TData, TError> {
	return useQuery({
		queryKey,
		queryFn,
		enabled,
		...options,
	});
}

/**
 * Hook for creating queries with dependent data
 */
export function useBaseQueryDependent<TData, TError = Error>(
	queryKey: unknown[],
	queryFn: () => Promise<TData>,
	enabled: boolean,
	options?: Omit<
		UseQueryOptions<TData, TError>,
		"queryKey" | "queryFn" | "enabled"
	>,
): UseQueryResult<TData, TError> {
	return useQuery({
		queryKey,
		queryFn,
		enabled,
		...options,
	});
}
