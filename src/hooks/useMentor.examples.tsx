/**
 * Enhanced Mentor Registration Form with TanStack Query Hooks
 *
 * This example demonstrates how to use the custom TanStack Query hooks
 * for better error handling, real-time validation, and optimistic updates.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMentorValidation, useRegisterMentor } from "@/hooks";

// Form schema
const mentorSchema = z.object({
	walletAddress: z
		.string()
		.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
	username: z.string().min(3, "Username must be at least 3 characters"),
	bio: z.string().min(10, "Bio must be at least 10 characters"),
});

type FormData = z.infer<typeof mentorSchema>;

export function EnhancedMentorForm() {
	const form = useForm<FormData>({
		resolver: zodResolver(mentorSchema),
		defaultValues: {
			walletAddress: "",
			fullName: "",
			username: "",
			bio: "",
		},
	});

	// Use custom hooks for validation and registration
	const { checkUsername, checkWallet, isCheckingUsername, isCheckingWallet } =
		useMentorValidation();
	const registerMutation = useRegisterMentor();

	const onSubmit = async (data: FormData) => {
		registerMutation.mutate(data, {
			onSuccess: () => {
				// Navigate to success page or reset form
				form.reset();
			},
		});
	};

	const handleUsernameBlur = () => {
		const username = form.getValues("username");
		if (username) {
			checkUsername(username);
		}
	};

	const handleWalletBlur = () => {
		const walletAddress = form.getValues("walletAddress");
		if (walletAddress) {
			checkWallet(walletAddress);
		}
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			{/* Username Field */}
			<div>
				<label htmlFor="username">Username</label>
				<input
					id="username"
					{...form.register("username")}
					onBlur={handleUsernameBlur}
					placeholder="johndoe"
				/>
				{isCheckingUsername && <span>Checking availability...</span>}
				{form.formState.errors.username && (
					<span>{form.formState.errors.username.message}</span>
				)}
			</div>

			{/* Wallet Address Field */}
			<div>
				<label htmlFor="walletAddress">Wallet Address</label>
				<input
					id="walletAddress"
					{...form.register("walletAddress")}
					onBlur={handleWalletBlur}
					placeholder="0x..."
				/>
				{isCheckingWallet && <span>Checking wallet...</span>}
				{form.formState.errors.walletAddress && (
					<span>{form.formState.errors.walletAddress.message}</span>
				)}
			</div>

			{/* Full Name Field */}
			<div>
				<label htmlFor="fullName">Full Name</label>
				<input
					id="fullName"
					{...form.register("fullName")}
					placeholder="John Doe"
				/>
				{form.formState.errors.fullName && (
					<span>{form.formState.errors.fullName.message}</span>
				)}
			</div>

			{/* Bio Field */}
			<div>
				<label htmlFor="bio">Bio</label>
				<textarea
					id="bio"
					{...form.register("bio")}
					placeholder="Tell us about yourself..."
				/>
				{form.formState.errors.bio && (
					<span>{form.formState.errors.bio.message}</span>
				)}
			</div>

			{/* Submit Button */}
			<button type="submit" disabled={registerMutation.isPending}>
				{registerMutation.isPending ? "Registering..." : "Register as Mentor"}
			</button>

			{/* Error Display */}
			{registerMutation.error && (
				<div role="alert">{registerMutation.error.message}</div>
			)}
		</form>
	);
}

/**
 * Example 2: Using useMentor to display mentor information
 */
export function MentorProfile({ username }: { username: string }) {
	const { data: mentor, isLoading, error } = useMentor(username);

	if (isLoading) return <div>Loading mentor profile...</div>;
	if (error) return <div>Error loading mentor: {error.message}</div>;
	if (!mentor) return <div>Mentor not found</div>;

	return (
		<div>
			<h2>{mentor.fullName}</h2>
			<p>@{mentor.username}</p>
			<p>Status: {mentor.status}</p>
			<p>{mentor.bio}</p>
		</div>
	);
}

/**
 * Example 3: Using useMentorByWallet to check if wallet is registered
 */
export function WalletRegistrationStatus({
	walletAddress,
}: {
	walletAddress: string;
}) {
	const { data: mentor, isLoading } = useMentorByWallet(walletAddress);

	if (isLoading) return <div>Checking wallet...</div>;

	return (
		<div>
			{mentor ? (
				<div>
					<p>This wallet is already registered to: {mentor.fullName}</p>
					<p>Username: @{mentor.username}</p>
				</div>
			) : (
				<p>This wallet is not registered yet.</p>
			)}
		</div>
	);
}

/**
 * Example 4: Optimistic updates in action
 */
export function OptimisticUpdateExample() {
	const queryClient = useQueryClient();
	const updateMutation = useMutation({
		mutationFn: async (data: { username: string; bio: string }) => {
			// API call would go here
			return data;
		},
		onMutate: async (newData) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["mentors"] });

			// Snapshot previous value
			const previousMentor = queryClient.getQueryData([
				"mentors",
				newData.username,
			]);

			// Optimistically update to new value
			queryClient.setQueryData(["mentors", newData.username], (old) => ({
				...old,
				bio: newData.bio,
			}));

			// Return context with snapshot
			return { previousMentor };
		},
		onError: (_err, newData, context) => {
			// Rollback on error
			queryClient.setQueryData(
				["mentors", newData.username],
				context?.previousMentor,
			);
		},
		onSettled: (_data, _error, variables) => {
			// Sync with server after mutation
			queryClient.invalidateQueries({
				queryKey: ["mentors", variables.username],
			});
		},
	});

	return (
		<button
			type="button"
			onClick={() =>
				updateMutation.mutate({
					username: "johndoe",
					bio: "Updated bio",
				})
			}
			disabled={updateMutation.isPending}
		>
			{updateMutation.isPending ? "Updating..." : "Update Bio"}
		</button>
	);
}

/**
 * Example 5: Real-time validation with debouncing
 */
export function RealTimeValidationForm() {
	const _form = useForm<FormData>({
		resolver: zodResolver(mentorSchema),
	});

	const [username, setUsername] = useState("");
	const { checkUsername, isCheckingUsername } = useMentorValidation();

	// Debounced validation
	useEffect(() => {
		if (username.length >= 3) {
			const timer = setTimeout(() => {
				checkUsername(username);
			}, 500);

			return () => clearTimeout(timer);
		}
	}, [username]);

	return (
		<form>
			<input
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
			/>
			{isCheckingUsername && <span>Checking...</span>}
		</form>
	);
}
