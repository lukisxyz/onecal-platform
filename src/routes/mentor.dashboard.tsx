import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock, FileText, Loader2, User } from "lucide-react";
import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMentorProfile } from "@/hooks/use-mentor-profile";

export const Route = createFileRoute("/mentor/dashboard")({
	component: MentorDashboard,
	head: () => ({
		title: "Mentor Dashboard - 0xCAL",
		meta: [
			{
				name: "description",
				content: "Manage your mentor profile and mentees on 0xCAL",
			},
		],
	}),
});

function MentorDashboard() {
	const { address, isConnected } = useAccount();
	const nav = useNavigate();
	const {
		data: profile,
		isLoading: loading,
		error,
	} = useMentorProfile(address);

	// Redirect to registration if wallet not connected
	if (!isConnected) {
		return (
			<div className="container max-w-4xl mx-auto py-12 px-4">
				<Card>
					<CardHeader>
						<CardTitle>Wallet Not Connected</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground mb-4">
							Please connect your wallet to view your mentor dashboard.
						</p>
						<Button onClick={() => nav({ to: "/mentor/register" })}>
							Go to Registration
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="container max-w-4xl mx-auto py-12 px-4 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container max-w-4xl mx-auto py-12 px-4">
				<Card>
					<CardHeader>
						<CardTitle>Error Loading Profile</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-red-600 mb-4">{error.message}</p>
						<Button onClick={() => window.location.reload()}>Try Again</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="container max-w-4xl mx-auto py-12 px-4">
				<Card>
					<CardHeader>
						<CardTitle>Profile Not Found</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground mb-4">
							No mentor profile found for this wallet address.
						</p>
						<Button onClick={() => nav({ to: "/mentor/register" })}>
							Register as Mentor
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="container max-w-4xl mx-auto py-12 px-4">
			<div className="mb-8">
				<Badge className="mb-4 px-3 py-1.5 font-bold">Mentor Dashboard</Badge>
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
					Welcome, {profile.fullName}
				</h1>
				<p className="text-lg text-muted-foreground mt-2">
					Manage your profile and track your mentoring activities
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Profile Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Full Name
							</p>
							<p className="text-lg">{profile.fullName}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Username
							</p>
							<p className="text-lg">@{profile.username}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Wallet Address
							</p>
							<p className="text-sm font-mono break-all">
								{profile.walletAddress}
							</p>
						</div>
						{profile.bio && (
							<div>
								<p className="text-sm font-medium text-muted-foreground">Bio</p>
								<p className="text-sm">{profile.bio}</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Additional Info
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Timezone
							</p>
							<p className="text-lg">{profile.timezone}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Member Since
							</p>
							<p className="text-lg">{formatDate(profile.createdAt)}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Last Updated
							</p>
							<p className="text-lg">{formatDate(profile.updatedAt)}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Quick Actions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-3">
						<Button
							variant="outline"
							onClick={() => nav({ to: "/mentor/register" })}
						>
							Update Profile
						</Button>
						<Button variant="outline" disabled>
							View Sessions (Coming Soon)
						</Button>
						<Button variant="outline" disabled>
							Earnings (Coming Soon)
						</Button>
						<Button variant="outline" disabled>
							Settings (Coming Soon)
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
