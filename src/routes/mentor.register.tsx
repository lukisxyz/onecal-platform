import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	CheckCircle2,
	FileText,
	Hash,
	Loader2,
	User,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Form validation schema
const mentorRegistrationSchema = z
	.object({
		walletAddress: z
			.string()
			.min(1, "Wallet address is required")
			.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
		fullName: z
			.string()
			.min(2, "Full name must be at least 2 characters")
			.max(50, "Full name must be less than 50 characters"),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(20, "Username must be less than 20 characters")
			.regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscore allowed")
			.refine((val) => !val.startsWith("_") && !val.endsWith("_"), {
				message: "Username cannot start or end with underscore",
			}),
		bio: z
			.string()
			.min(10, "Bio must be at least 10 characters")
			.max(500, "Bio must be less than 500 characters"),
	})
	.refine(
		(data) => {
			const words = data.fullName.trim().split(/\s+/);
			return words.length >= 2;
		},
		{
			message: "Please enter your full name (first and last name)",
			path: ["fullName"],
		},
	);

type MentorRegistrationForm = z.infer<typeof mentorRegistrationSchema>;

export const Route = createFileRoute("/mentor/register")({
	component: MentorRegister,
	head: () => ({
		title: "Register as Mentor - 0xCAL",
		meta: [
			{
				name: "description",
				content:
					"Join 0xCAL as a mentor and start earning IDRX with commitment-fee based scheduling",
			},
		],
	}),
});

function MentorRegister() {
	const navigate = useNavigate();
	const { address, isConnected } = useAccount();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm<MentorRegistrationForm>({
		resolver: zodResolver(mentorRegistrationSchema),
		defaultValues: {
			walletAddress: "",
			fullName: "",
			username: "",
			bio: "",
		},
	});

	// Handle wallet connection
	const handleConnectWallet = () => {
		if (isConnected && address) {
			form.setValue("walletAddress", address);
			toast.success("Wallet address filled", {
				description: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
			});
		}
	};

	// Form submission handler
	const onSubmit = async (data: MentorRegistrationForm) => {
		setIsSubmitting(true);
		setSubmitStatus("idle");
		setErrorMessage("");

		try {
			// Import the server function dynamically
			const { registerMentorViaRelayer } = await import(
				"@/utils/mentor.functions"
			);

			// Call the server function
			const _result = await registerMentorViaRelayer({ data });

			setSubmitStatus("success");
			toast.success("Registration submitted successfully!", {
				description: "You'll be redirected shortly.",
			});

			// Navigate to success page after a delay
			setTimeout(() => {
				navigate({ to: "/mentor/success", state: { registrationData: data } });
			}, 2000);
		} catch (error) {
			console.error("Registration error:", error);
			setSubmitStatus("error");

			const errorMsg =
				error instanceof Error
					? error.message
					: "Registration failed. Please try again.";

			setErrorMessage(errorMsg);
			toast.error("Registration Failed", {
				description: errorMsg,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Success state
	if (submitStatus === "success") {
		return (
			<div className="container max-w-2xl mx-auto py-12 px-4">
				<Card>
					<CardHeader className="text-center">
						<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
							<CheckCircle2 className="w-8 h-8 text-green-600" />
						</div>
						<CardTitle className="text-2xl">Registration Submitted!</CardTitle>
						<CardDescription>
							Your mentor registration has been submitted successfully. You'll
							be redirected shortly.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="container max-w-2xl mx-auto py-12 px-4">
			<div className="mb-8">
				<Badge
					variant="secondary"
					className="mb-4 px-3 py-1.5 font-bold text-white bg-blue-700"
				>
					Mentor Registration
				</Badge>
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
					Join 0xCAL as a Mentor
				</h1>
				<p className="text-lg text-muted-foreground">
					Create your profile and start earning with IDRX through commitment-fee
					based scheduling
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Mentor Information</CardTitle>
					<CardDescription>
						Fill in your details to create your mentor profile. All fields are
						required.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Wallet Address Field */}
							<FormField
								control={form.control}
								name="walletAddress"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Wallet className="w-4 h-4" />
											Wallet Address
										</FormLabel>
										<FormControl>
											<div className="flex gap-2">
												<Input
													placeholder="0x..."
													{...field}
													className="font-mono"
												/>
												{isConnected && address && (
													<Button
														type="button"
														variant="outline"
														onClick={handleConnectWallet}
													>
														Use Connected
													</Button>
												)}
											</div>
										</FormControl>
										<FormDescription>
											Your wallet address for receiving IDRX payments
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Full Name Field */}
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<User className="w-4 h-4" />
											Full Name
										</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormDescription>
											Your full name as you want it to appear to mentees
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Username Field */}
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Hash className="w-4 h-4" />
											Username
										</FormLabel>
										<FormControl>
											<Input
												placeholder="johndoe"
												{...field}
												className="font-mono"
											/>
										</FormControl>
										<FormDescription>
											Unique identifier (3-20 chars, alphanumeric and underscore
											only)
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Bio Field */}
							<FormField
								control={form.control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<FileText className="w-4 h-4" />
											Bio
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Tell us about yourself, your expertise, and what you can offer to mentees..."
												className="min-h-[120px] resize-y"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											<Badge variant="outline">
												{field.value?.length || 0}/500
											</Badge>{" "}
											Describe your background and expertise
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Error Alert */}
							{submitStatus === "error" && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{errorMessage}</AlertDescription>
								</Alert>
							)}

							{/* Submit Button */}
							<div className="flex flex-col gap-4">
								<Button
									type="submit"
									className="w-full"
									disabled={isSubmitting}
									size="lg"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Registering Mentor...
										</>
									) : (
										"Register as Mentor"
									)}
								</Button>

								<p className="text-xs text-center text-muted-foreground">
									By registering, you agree to our Terms of Service and Privacy
									Policy. Registration requires on-chain transaction.
								</p>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{/* Info Cards */}
			<div className="mt-8 grid gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col items-center text-center">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
								<Wallet className="w-6 h-6 text-blue-600" />
							</div>
							<h3 className="font-semibold mb-1">IDRX Payments</h3>
							<p className="text-sm text-muted-foreground">
								Receive stablecoin payments directly to your wallet
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col items-center text-center">
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
								<svg
									className="w-6 h-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Lightning bolt icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold mb-1">Zero Gas Fees</h3>
							<p className="text-sm text-muted-foreground">
								Meta-transaction technology handles all gas costs
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col items-center text-center">
							<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
								<CheckCircle2 className="w-6 h-6 text-purple-600" />
							</div>
							<h3 className="font-semibold mb-1">Reduce No-Shows</h3>
							<p className="text-sm text-muted-foreground">
								Commitment fees ensure mentees show up
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
