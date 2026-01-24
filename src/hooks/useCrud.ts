import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Generic CRUD operations interface
 */
export interface CrudOperations<T> {
	getAll: () => Promise<T[]>;
	getById: (id: string | number) => Promise<T>;
	create: (data: Omit<T, "id">) => Promise<T>;
	update: (id: string | number, data: Partial<T>) => Promise<T>;
	delete: (id: string | number) => Promise<void>;
}

/**
 * Hook for managing CRUD operations
 */
export function useCrud<T extends { id: string | number }>(
	baseUrl: string,
	options?: {
		queryKey?: unknown[];
		revalidateQueries?: boolean;
	},
) {
	const { queryKey = [baseUrl], revalidateQueries = true } = options || {};
	const queryClient = useQueryClient();

	// GET ALL
	const useGetAll = <TData = T[]>() =>
		useQuery({
			queryKey,
			queryFn: async () => {
				const response = await fetch(baseUrl);
				if (!response.ok) throw new Error("Failed to fetch");
				return (await response.json()) as TData;
			},
			staleTime: 60 * 1000,
		});

	// GET BY ID
	const useGetById = <TData = T>(id: string | number | undefined | null) =>
		useQuery({
			queryKey: [...queryKey, id],
			enabled: !!id,
			queryFn: async () => {
				const response = await fetch(`${baseUrl}/${id}`);
				if (!response.ok) throw new Error("Failed to fetch item");
				return (await response.json()) as TData;
			},
			staleTime: 60 * 1000,
		});

	// CREATE
	const useCreate = <TData = T>() => {
		return useMutation({
			mutationFn: async (data: Omit<T, "id">) => {
				const response = await fetch(baseUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				if (!response.ok) throw new Error("Failed to create");
				return (await response.json()) as TData;
			},
			onSuccess: () => {
				if (revalidateQueries) {
					queryClient.invalidateQueries({ queryKey });
				}
			},
		});
	};

	// UPDATE
	const useUpdate = <TData = T>() => {
		return useMutation({
			mutationFn: async ({
				id,
				data,
			}: {
				id: string | number;
				data: Partial<T>;
			}) => {
				const response = await fetch(`${baseUrl}/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				if (!response.ok) throw new Error("Failed to update");
				return (await response.json()) as TData;
			},
			onSuccess: (data, variables) => {
				if (revalidateQueries) {
					queryClient.invalidateQueries({ queryKey });
					queryClient.setQueryData([...queryKey, variables.id], data);
				}
			},
		});
	};

	// DELETE
	const useDelete = () => {
		return useMutation({
			mutationFn: async (id: string | number) => {
				const response = await fetch(`${baseUrl}/${id}`, {
					method: "DELETE",
				});
				if (!response.ok) throw new Error("Failed to delete");
				return (await response.json()) as undefined;
			},
			onSuccess: (_, id) => {
				if (revalidateQueries) {
					queryClient.invalidateQueries({ queryKey });
					queryClient.removeQueries({ queryKey: [...queryKey, id] });
				}
			},
		});
	};

	return {
		useGetAll,
		useGetById,
		useCreate,
		useUpdate,
		useDelete,
	};
}

/**
 * Hook for optimistic updates
 */
export function useCrudWithOptimistic<T extends { id: string | number }>(
	baseUrl: string,
	options?: {
		queryKey?: unknown[];
		revalidateQueries?: boolean;
	},
) {
	const { queryKey = [baseUrl], revalidateQueries = true } = options || {};
	const queryClient = useQueryClient();

	// CREATE WITH OPTIMISTIC UPDATE
	const useCreateOptimistic = <TData = T>() => {
		return useMutation({
			mutationFn: async (data: Omit<T, "id">) => {
				const response = await fetch(baseUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				if (!response.ok) throw new Error("Failed to create");
				return (await response.json()) as TData;
			},
			onMutate: async (newData) => {
				// Cancel outgoing refetches
				await queryClient.cancelQueries({ queryKey });

				// Snapshot previous value
				const previousData = queryClient.getQueryData<T[]>(queryKey);

				// Optimistically update to new value
				if (previousData) {
					queryClient.setQueryData<T[]>(queryKey, (old) => [
						...(old || []),
						newData as unknown as T,
					]);
				}

				return { previousData };
			},
			onError: (_err, _newData, context) => {
				// Rollback on error
				if (context?.previousData) {
					queryClient.setQueryData(queryKey, context.previousData);
				}
			},
			onSettled: (_data, _error, _variables) => {
				if (revalidateQueries) {
					queryClient.invalidateQueries({ queryKey });
				}
			},
		});
	};

	// UPDATE WITH OPTIMISTIC UPDATE
	const useUpdateOptimistic = <TData = T>() => {
		return useMutation({
			mutationFn: async ({
				id,
				data,
			}: {
				id: string | number;
				data: Partial<T>;
			}) => {
				const response = await fetch(`${baseUrl}/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				if (!response.ok) throw new Error("Failed to update");
				return (await response.json()) as TData;
			},
			onMutate: async ({ id, data: newData }) => {
				await queryClient.cancelQueries({ queryKey });

				const previousData = queryClient.getQueryData<T[]>(queryKey);

				if (previousData) {
					queryClient.setQueryData<T[]>(queryKey, (old) =>
						(old || []).map((item) =>
							item.id === id ? { ...item, ...newData } : item,
						),
					);
				}

				return { previousData };
			},
			onError: (_err, _variables, context) => {
				if (context?.previousData) {
					queryClient.setQueryData(queryKey, context.previousData);
				}
			},
			onSettled: (_data, _error, _variables) => {
				if (revalidateQueries) {
					queryClient.invalidateQueries({ queryKey });
				}
			},
		});
	};

	return {
		useCreate: useCreateOptimistic,
		useUpdate: useUpdateOptimistic,
	};
}
