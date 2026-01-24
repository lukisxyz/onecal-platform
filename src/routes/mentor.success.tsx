import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	CheckCircle2,
	ExternalLink,
	FileText,
	Hash,
	User,
	Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { MentorRegistrationData } from "@/utils/mentor.server";

export const Route = createFileRoute("/mentor/success")({
	component: MentorSuccess,
	head: () => ({
		title: "Registration Successful - 0xCAL",
		meta: [
			{
				name: "description",
				content: "Your mentor registration has been completed successfully",
			},
		],
	}),
});

function MentorSuccess() {
	const navigate = useNavigate();
	const location = useLocation();
	const [countdown, setCountdown] = useState(5);

	const registrationData =
		(location.state as { registrationData?: MentorRegistrationData })
			?.registrationData ?? null;

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (registrationData?.username) {
			navigate({ to: `/mentor/profile/${registrationData?.username}` });
		}
	}, [countdown, navigate, registrationData]);

	if (!registrationData) {
		return (
			<div className="container max-w-2xl mx-auto py-12 px-4">
				<Card>
					<CardHeader className="text-center">
						<CardTitle>No Registration Data Found</CardTitle>
						<CardDescription>
							Please register as a mentor to continue
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => navigate({ to: "/mentor/register" })}
							className="w-full"
						>
							Go to Registration
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container max-w-2xl mx-auto py-12 px-4">
			<Card>
				<CardHeader className="text-center">
					<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
						<CheckCircle2 className="w-8 h-8 text-green-600" />
					</div>
					<CardTitle className="text-3xl">Registration Successful!</CardTitle>
					<CardDescription className="text-base">
						Your mentor profile has been created and submitted to the blockchain
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Registration Details */}
					<div className="bg-muted/50 rounded-lg p-4 space-y-4">
						<h3 className="font-semibold text-lg">Registration Details</h3>

						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<Wallet className="w-4 h-4 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">
										Wallet Address
									</p>
									<p className="font-mono text-sm">
										{registrationData.walletAddress}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<User className="w-4 h-4 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Full Name</p>
									<p className="font-medium">{registrationData.fullName}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Hash className="w-4 h-4 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Username</p>
									<p className="font-mono font-medium">
										{registrationData.username}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FileText className="w-4 h-4 text-muted-foreground mt-1" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Bio</p>
									<p className="text-sm">{registrationData.bio}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Status */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-2">
							<Badge variant="secondary" className="bg-blue-100">
								Status
							</Badge>
							<Badge
								variant="outline"
								className="bg-yellow-100 border-yellow-300"
							>
								Pending On-Chain Confirmation
							</Badge>
						</div>
						<p className="text-sm text-muted-foreground">
							Your registration is being processed. Once confirmed on the
							blockchain, you'll be able to start receiving bookings.
						</p>
					</div>

					{/* Next Steps */}
					<div className="bg-green-50 border border-green-200 rounded-lg p-4">
						<h4 className="font-semibold mb-2">Next Steps:</h4>
						<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
							<li>Wait for blockchain confirmation</li>
							<li>Complete your mentor profile</li>
							<li>Set your availability and rates</li>
							<li>Start receiving bookings!</li>
						</ul>
					</div>

					{/* Actions */}
					<div className="flex flex-col gap-3 pt-4">
						<Button
							onClick={() =>
								navigate({
									to: `/mentor/profile/${registrationData.username}`,
								})
							}
							className="w-full"
							size="lg"
						>
							View Your Profile
							<ExternalLink className="ml-2 w-4 h-4" />
						</Button>

						<Button
							variant="outline"
							onClick={() => navigate({ to: "/" })}
							className="w-full"
						>
							Back to Home
						</Button>

						<p className="text-xs text-center text-muted-foreground pt-2">
							Redirecting to your profile in {countdown} seconds...
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Import useLocation hook
import { useLocation } from "@tanstack/react-router";
