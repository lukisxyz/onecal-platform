// Base hooks

// API hooks
export { useApiGetQuery, useApiPostQuery, useApiQuery } from "./useApiQuery";
export {
	useBaseMutation,
	useBaseMutationWithOptimistic,
} from "./useBaseMutation";
export {
	useBaseQuery,
	useBaseQueryDependent,
	useBaseQueryEnabled,
} from "./useBaseQuery";

// CRUD hooks
export { useCrud, useCrudWithOptimistic } from "./useCrud";
// Mentor-specific hooks
export {
	type Mentor,
	type MentorRegistrationData,
	mentorKeys,
	useCheckUsernameAvailability,
	useCheckWalletAvailability,
	useMentor,
	useMentorByWallet,
	useMentorValidation,
	useRegisterMentor,
} from "./useMentor";
// Paginated query hooks
export {
	useCursorQuery,
	useInfiniteQuery,
	usePaginatedQuery,
} from "./usePaginatedQuery";
