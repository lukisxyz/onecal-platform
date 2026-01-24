import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	Badge as BadgeIcon,
	Calendar,
	Clock,
	Copy,
	ExternalLink,
	MessageCircle,
	Star,
	Users,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMentor } from "@/hooks";

export const Route = createFileRoute("/mentor/profile/$id_profile")({
	component: MentorProfilePage,
	head: ({ params }) => ({
		title: `Mentor Profile: ${params.id_profile} - 0xCAL`,
		meta: [
			{
				name: "description",
				content: `View mentor profile and book sessions on 0xCAL`,
			},
		],
	}),
});

function MentorProfilePage() {
	const navigate = useNavigate();
	const { id_profile } = Route.useParams();
	const { data: mentor, isLoading, error } = useMentor(id_profile);
	const [_imageError, _setImageError] = useState(false);

	const handleCopyWallet = () => {
		if (mentor?.walletAddress) {
			navigator.clipboard.writeText(mentor.walletAddress);
			toast.success("Wallet address copied!", {
				description: "Wallet address has been copied to clipboard",
			});
		}
	};

	const handleGoBack = () => {
		navigate({ to: "/" });
	};

	// Loading state
	if (isLoading) {
		return <MentorProfileSkeleton />;
	}

	// Error state
	if (error) {
		return (
			<div className="container max-w-4xl mx-auto py-12 px-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
								<BadgeIcon className="w-8 h-8 text-red-600" />
							</div>
							<h2 className="text-2xl font-bold mb-2">Mentor Not Found</h2>
							<p className="text-muted-foreground mb-6">
								The mentor you're looking for doesn't exist or has been removed.
							</p>
							<Button onClick={handleGoBack}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Go Back
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Not found state
	if (!mentor) {
		return (
			<div className="container max-w-4xl mx-auto py-12 px-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
							<BadgeIcon className="w-16 h-16 text-muted-foreground mb-4" />
							<h2 className="text-2xl font-bold mb-2">No Profile Data</h2>
							<p className="text-muted-foreground mb-6">
								This mentor hasn't completed their profile setup yet.
							</p>
							<Button onClick={handleGoBack}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Go Back
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "registered":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			{/* Header */}
			<div className="bg-white border-b">
				<div className="container max-w-6xl mx-auto px-4 py-4">
					<Button variant="ghost" onClick={handleGoBack} className="mb-4">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				</div>
			</div>

			{/* Profile Content */}
			<div className="container max-w-6xl mx-auto py-8 px-4">
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main Profile Card - Left Column */}
					<div className="lg:col-span-2 space-y-6">
						{/* Basic Info Card */}
						<Card>
							<CardHeader>
								<div className="flex items-start gap-4">
									<Avatar className="w-20 h-20">
										<AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
											{getInitials(mentor.fullName)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<CardTitle className="text-3xl">
												{mentor.fullName}
											</CardTitle>
											<Badge className={getStatusColor(mentor.status)}>
												{mentor.status.charAt(0).toUpperCase() +
													mentor.status.slice(1)}
											</Badge>
										</div>
										<CardDescription className="text-lg">
											@{mentor.username}
										</CardDescription>
										<div className="flex items-center gap-2 mt-3">
											<Button
												variant="outline"
												size="sm"
												onClick={handleCopyWallet}
											>
												<Wallet className="mr-2 h-4 w-4" />
												Copy Wallet
											</Button>
											<Button variant="outline" size="sm">
												<ExternalLink className="mr-2 h-4 w-4" />
												View on Explorer
											</Button>
										</div>
									</div>
								</div>
							</CardHeader>
						</Card>

						{/* Bio Card */}
						<Card>
							<CardHeader>
								<CardTitle>About</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
									{mentor.bio}
								</p>
							</CardContent>
						</Card>

						{/* Stats Card */}
						<Card>
							<CardHeader>
								<CardTitle>Mentor Statistics</CardTitle>
								<CardDescription>
									Performance and engagement metrics
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="bg-blue-50 rounded-lg p-4 text-center">
										<Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
										<p className="text-2xl font-bold">0</p>
										<p className="text-sm text-muted-foreground">Mentees</p>
									</div>
									<div className="bg-green-50 rounded-lg p-4 text-center">
										<Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
										<p className="text-2xl font-bold">0</p>
										<p className="text-sm text-muted-foreground">Sessions</p>
									</div>
									<div className="bg-yellow-50 rounded-lg p-4 text-center">
										<Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
										<p className="text-2xl font-bold">5.0</p>
										<p className="text-sm text-muted-foreground">Rating</p>
									</div>
									<div className="bg-purple-50 rounded-lg p-4 text-center">
										<Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
										<p className="text-2xl font-bold">0</p>
										<p className="text-sm text-muted-foreground">Hours</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Availability Card */}
						<Card>
							<CardHeader>
								<CardTitle>Availability</CardTitle>
								<CardDescription>
									Upcoming availability for sessions
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8 text-muted-foreground">
									<Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
									<p>No upcoming availability</p>
									<p className="text-sm">Check back later for new time slots</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar - Right Column */}
					<div className="space-y-6">
						{/* Quick Actions Card */}
						<Card>
							<CardHeader>
								<CardTitle>Book a Session</CardTitle>
								<CardDescription>
									Schedule time with this mentor
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button className="w-full" size="lg">
									<Calendar className="mr-2 h-4 w-4" />
									Book Session
								</Button>
								<Button variant="outline" className="w-full">
									<MessageCircle className="mr-2 h-4 w-4" />
									Send Message
								</Button>
								<Button variant="outline" className="w-full">
									<Star className="mr-2 h-4 w-4" />
									Add to Favorites
								</Button>
							</CardContent>
						</Card>

						{/* Contact Info Card */}
						<Card>
							<CardHeader>
								<CardTitle>Contact Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Wallet Address
									</p>
									<div className="flex items-center gap-2">
										<p className="text-sm font-mono bg-muted p-2 rounded flex-1 overflow-hidden text-ellipsis">
											{mentor.walletAddress}
										</p>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleCopyWallet}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>
								<Separator />
								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Member Since
									</p>
									<p className="text-sm">
										{new Date(mentor.createdAt).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								</div>
								{mentor.registeredAt && (
									<>
										<Separator />
										<div>
											<p className="text-sm text-muted-foreground mb-1">
												On-chain Registered
											</p>
											<p className="text-sm">
												{new Date(mentor.registeredAt).toLocaleDateString(
													"en-US",
													{
														month: "long",
														day: "numeric",
														year: "numeric",
													},
												)}
											</p>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Tags Card */}
						<Card>
							<CardHeader>
								<CardTitle>Expertise Tags</CardTitle>
								<CardDescription>Areas of knowledge</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{/* Placeholder for expertise tags - could be fetched from API */}
									<Badge variant="secondary">Blockchain</Badge>
									<Badge variant="secondary">Web3</Badge>
									<Badge variant="secondary">Smart Contracts</Badge>
									<Badge variant="secondary">DeFi</Badge>
								</div>
							</CardContent>
						</Card>

						{/* Reviews Card */}
						<Card>
							<CardHeader>
								<CardTitle>Reviews</CardTitle>
								<CardDescription>What mentees say</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8 text-muted-foreground">
									<Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
									<p>No reviews yet</p>
									<p className="text-sm">Be the first to book and review</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

function MentorProfileSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<div className="bg-white border-b">
				<div className="container max-w-6xl mx-auto px-4 py-4">
					<Skeleton className="h-10 w-24" />
				</div>
			</div>

			<div className="container max-w-6xl mx-auto py-8 px-4">
				<div className="grid gap-6 lg:grid-cols-3">
					<div className="lg:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-start gap-4">
									<Skeleton className="w-20 h-20 rounded-full" />
									<div className="flex-1 space-y-3">
										<Skeleton className="h-8 w-64" />
										<Skeleton className="h-6 w-32" />
										<div className="flex gap-2">
											<Skeleton className="h-9 w-32" />
											<Skeleton className="h-9 w-32" />
										</div>
									</div>
								</div>
							</CardHeader>
						</Card>

						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-24" />
							</CardHeader>
							<CardContent className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-48" />
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{["mentees", "sessions", "rating", "hours"].map((stat) => (
										<div key={stat} className="space-y-2">
											<Skeleton className="h-6 w-6 mx-auto" />
											<Skeleton className="h-8 w-12 mx-auto" />
											<Skeleton className="h-4 w-16 mx-auto" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-6">
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-32" />
							</CardHeader>
							<CardContent className="space-y-2">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-40" />
							</CardHeader>
							<CardContent className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-10 w-full" />
								<Separator />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-2/3" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-32" />
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									<Skeleton className="h-6 w-24" />
									<Skeleton className="h-6 w-20" />
									<Skeleton className="h-6 w-28" />
									<Skeleton className="h-6 w-16" />
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
