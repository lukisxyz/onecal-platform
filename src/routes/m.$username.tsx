import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Clock, ExternalLink } from "lucide-react";
import { useMentorProfileByUsername } from "@/hooks/use-mentor-profile";

export const Route = createFileRoute("/m/$username")({
	component: MentorPublicProfile,
	head: () => ({
		title: "Mentor Profile - 0xCAL",
		meta: [
			{
				name: "description",
				content: "View mentor profile on 0xCAL",
			},
		],
	}),
});

function MentorPublicProfile() {
	const { username } = Route.useParams();
	const {
		data: profile,
		isLoading: loading,
		error,
	} = useMentorProfileByUsername(username);

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

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
						<CardTitle>Profile Not Found</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							{error.message || "Mentor profile not found"}
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!profile && !loading) {
		return (
			<div className="container max-w-4xl mx-auto py-12 px-4">
				<Card>
					<CardHeader>
						<CardTitle>No Profile Available</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							This mentor profile is not available.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container max-w-4xl mx-auto py-12 px-4">
			<div className="mb-8">
				<Badge className="mb-4 px-3 py-1.5 font-bold">Mentor Profile</Badge>
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
					{profile?.fullName}
				</h1>
				<p className="text-lg text-muted-foreground mt-2">
					@{profile?.username}
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							About
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{profile?.bio && (
							<div>
								<p className="text-sm font-medium text-muted-foreground">Bio</p>
								<p className="text-sm mt-1">{profile.bio}</p>
							</div>
						)}
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Wallet Address
							</p>
							<div className="flex items-center gap-2 mt-1">
								<a
									href={`https://sepolia.basescan.org/address/${profile?.walletAddress}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm font-mono text-blue-600 hover:text-blue-800"
								>
									{`${profile?.walletAddress.slice(0, 14)}...${profile?.walletAddress.slice(-7)}`}
								</a>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Timezone
							</p>
							<p className="text-lg">{profile?.timezone}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Member Since
							</p>
							<p className="text-lg">
								{profile ? formatDate(profile.createdAt) : ""}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
