import {
	type UseMutationOptions,
	type UseMutationResult,
	useMutation,
} from "@tanstack/react-query";

/**
 * Base hook for creating reusable mutations
 */
export function useBaseMutation<
	TData,
	TError = Error,
	TVariables = void,
	TContext = unknown,
>(
	mutationFn: (variables: TVariables) => Promise<TData>,
	options?: Omit<
		UseMutationOptions<TData, TError, TVariables, TContext>,
		"mutationFn"
	>,
): UseMutationResult<TData, TError, TVariables, TContext> {
	return useMutation({
		mutationFn,
		...options,
	});
}

/**
 * Hook for creating mutations with optimistic updates
 */
export function useBaseMutationWithOptimistic<
	TData,
	TError = Error,
	TVariables = void,
	TContext = unknown,
>(
	mutationFn: (variables: TVariables) => Promise<TData>,
	options?: Omit<
		UseMutationOptions<TData, TError, TVariables, TContext>,
		"mutationFn"
	>,
): UseMutationResult<TData, TError, TVariables, TContext> {
	return useMutation({
		mutationFn,
		onMutate: async (variables) => {
			const context = await options?.onMutate?.(variables);
			return context;
		},
		onError: (err, variables, context) => {
			options?.onError?.(err, variables, context);
		},
		onSettled: (data, error, variables, context) => {
			options?.onSettled?.(data, error, variables, context);
		},
	});
}
