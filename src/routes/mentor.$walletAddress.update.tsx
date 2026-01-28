import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TIMEZONES } from "@/constants/timezones";
import { useMentorUsernameFromBlockchain } from "@/hooks/use-mentor-username-blockchain";
import {
	useMentorProfile,
	useUpdateMentorProfile,
} from "@/hooks/use-update-mentor-profile";

export const Route = createFileRoute("/mentor/$walletAddress/update")({
	component: MentorUpdateProfile,
	head: () => ({
		title: "Update Mentor Profile - 0xCAL",
		meta: [
			{
				name: "description",
				content: "Update your mentor profile on 0xCAL",
			},
		],
	}),
});

function MentorUpdateProfile() {
	const params = Route.useParams();
	const walletAddress = params.walletAddress;
	const nav = useNavigate();
	const { data: profile } = useMentorProfile(walletAddress);
	const { data: blockchainData } =
		useMentorUsernameFromBlockchain(walletAddress);
	const { updateProfile, isLoading: isUpdating } = useUpdateMentorProfile(
		walletAddress,
		profile?.username || blockchainData?.username,
	);

	const [fullName, setFullName] = useState(profile?.fullName || "");
	const [bio, setBio] = useState(profile?.bio || "");
	const [timezone, setTimezone] = useState(profile?.timezone || "");
	const [timezoneSearch, setTimezoneSearch] = useState("");

	// Filter timezones based on search
	const filteredTimezones = TIMEZONES.filter((tz) =>
		tz.label.toLowerCase().includes(timezoneSearch.toLowerCase()),
	).slice(0, 20);

	// Populate form when profile loads
	useEffect(() => {
		if (profile) {
			setFullName(profile.fullName);
			setBio(profile.bio || "");
			setTimezone(profile.timezone);
		}
	}, [profile]);

	const isFormValid = fullName && timezone;

	// Get username from profile or blockchain
	const username = profile?.username || blockchainData?.username;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid || !username) return;

		updateProfile({
			fullName,
			bio,
			timezone,
		});
	};

	return (
		<div className="container max-w-2xl mx-auto py-12 px-4">
			<div className="mb-8">
				<Badge className="mb-4 px-3 py-1.5 font-bold">Update Profile</Badge>
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
					Update Your Mentor Profile
				</h1>
				<p className="text-lg text-muted-foreground">
					Keep your profile information up to date
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Profile Information
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<p className="text-sm text-muted-foreground">
								Username is registered on the blockchain and cannot be changed
							</p>
							<Input
								id="username"
								type="text"
								value={username || ""}
								disabled
								className="bg-muted"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="fullName">Full Name</Label>
							<p className="text-sm text-muted-foreground">
								Your real name or display name
							</p>
							<Input
								id="fullName"
								type="text"
								placeholder="e.g., John Doe"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<p className="text-sm text-muted-foreground">
								Tell us about yourself and your expertise (optional)
							</p>
							<Textarea
								id="bio"
								placeholder="e.g., Blockchain developer with 5 years of experience..."
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								rows={4}
								maxLength={500}
							/>
							<p className="text-xs text-muted-foreground">
								{bio.length}/500 characters
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="timezone">Timezone</Label>
							<p className="text-sm text-muted-foreground">
								Your preferred timezone for scheduling sessions
							</p>
							<Select value={timezone} onValueChange={setTimezone} required>
								<SelectTrigger>
									<SelectValue placeholder="Select your timezone" />
								</SelectTrigger>
								<SelectContent>
									<div className="px-2 py-1">
										<Input
											type="text"
											placeholder="Search timezone..."
											value={timezoneSearch}
											onChange={(e) => setTimezoneSearch(e.target.value)}
											className="h-8"
										/>
									</div>
									{filteredTimezones.map((tz) => (
										<SelectItem key={tz.value} value={tz.value}>
											{tz.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="address">Wallet Address</Label>
							<p className="text-sm text-muted-foreground">
								Wallet address cannot be changed (registered on blockchain)
							</p>
							<Input
								id="address"
								type="text"
								value={walletAddress || ""}
								disabled
								className="bg-muted font-mono"
							/>
						</div>

						<div className="pt-4">
							<Button
								type="submit"
								className="w-full"
								size="lg"
								disabled={isUpdating || !isFormValid}
							>
								{isUpdating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating...
									</>
								) : (
									"Update Profile"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<div className="mt-6">
				<Button
					variant="outline"
					onClick={() => nav({ to: "/mentor/dashboard" })}
				>
					Back to Dashboard
				</Button>
			</div>
		</div>
	);
}
