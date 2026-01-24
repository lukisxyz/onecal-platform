import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiQueryOptions<TData, TError = Error> {
	method?: ApiMethod;
	body?: unknown;
	headers?: Record<string, string>;
	enabled?: boolean;
	staleTime?: number;
	gcTime?: number;
	refetchOnWindowFocus?: boolean;
	refetchOnMount?: boolean | "always";
	retry?: number | false;
	onSuccess?: (data: TData) => void;
	onError?: (error: TError) => void;
	queryKey?: unknown[];
}

/**
 * Flexible hook for making API requests
 */
export function useApiQuery<TData, TError = Error>(
	url: string,
	options?: ApiQueryOptions<TData, TError>,
) {
	const {
		method = "GET",
		body,
		headers,
		enabled = true,
		staleTime = 60 * 1000,
		gcTime = 10 * 60 * 1000,
		refetchOnWindowFocus = false,
		refetchOnMount = true,
		retry = 1,
		onSuccess,
		onError,
		queryKey,
	} = options || {};

	const queryKeyToUse = queryKey || [url, method, body];

	const queryOptions: UseQueryOptions<TData, TError> = {
		queryKey: queryKeyToUse,
		enabled,
		staleTime,
		gcTime,
		refetchOnWindowFocus,
		refetchOnMount,
		retry,
		queryFn: async () => {
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
				body: body ? JSON.stringify(body) : undefined,
			});

			if (!response.ok) {
				const error = new Error(`API Error: ${response.statusText}`) as TError;
				onError?.(error);
				throw error;
			}

			const data = (await response.json()) as TData;
			onSuccess?.(data);
			return data;
		},
	};

	return useQuery(queryOptions);
}

/**
 * Hook for GET requests with query parameters
 */
export function useApiGetQuery<TData, TError = Error>(
	url: string,
	params?: Record<string, string | number | boolean>,
	options?: Omit<ApiQueryOptions<TData, TError>, "method" | "body">,
) {
	const queryString = params
		? "?" +
			new URLSearchParams(
				Object.entries(params).map(([k, v]) => [k, String(v)]),
			).toString()
		: "";

	return useApiQuery<TData, TError>(url + queryString, {
		...options,
		method: "GET",
	});
}

/**
 * Hook for POST requests
 */
export function useApiPostQuery<TData, TError = Error>(
	url: string,
	body: unknown,
	options?: Omit<ApiQueryOptions<TData, TError>, "method" | "body">,
) {
	return useApiQuery<TData, TError>(url, {
		...options,
		method: "POST",
		body,
	});
}
