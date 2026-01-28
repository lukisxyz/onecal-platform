import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRegisterMentor } from "@/hooks/use-register-mentor";
import { NetworkSwitchPrompt } from "@/components/network-switch-prompt";
import { TIMEZONES } from "@/constants/timezones";
import { MENTOR_REGISTRY_ADDRESS, MENTOR_REGISTRY_ABI } from "@/contracts";
import { publicClient } from "@/lib/wagmi";
import { useNavigate } from "@tanstack/react-router";

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
	const [username, setUsername] = useState("");
	const [mentorAddress, setMentorAddress] = useState("");
	const [fullName, setFullName] = useState("");
	const [bio, setBio] = useState("");
	const [timezone, setTimezone] = useState("");
	const [timezoneSearch, setTimezoneSearch] = useState("");
	const [checkingRegistration, setCheckingRegistration] = useState(false);
	const { address, isConnected } = useAccount();
	const { connect, connectors, isPending: isConnecting } = useConnect();
	const { disconnect } = useDisconnect();
	const nav = useNavigate();

	const { registerMentor, isLoading, error } = useRegisterMentor();

	const isFormValid =
		username && mentorAddress && fullName && timezone && isConnected;

	// Filter timezones based on search
	const filteredTimezones = TIMEZONES.filter((tz) =>
		tz.label.toLowerCase().includes(timezoneSearch.toLowerCase()),
	).slice(0, 20); // Limit to 20 results for better UX

	useEffect(() => {
		const checkRegistration = async () => {
			if (!address || !isConnected) return;

			setCheckingRegistration(true);
			try {
				// Check if wallet is already registered on blockchain
				const walletRegistration = await publicClient.readContract({
					address: MENTOR_REGISTRY_ADDRESS,
					abi: MENTOR_REGISTRY_ABI,
					functionName: "getMentorByAddress",
					args: [address],
				});

				const [, , walletExists] = walletRegistration as [
					string,
					`0x${string}`,
					boolean,
				];

				if (walletExists) {
					// Wallet is registered, redirect to update page
					nav({ to: `/mentor/${address}/update` });
					return;
				}
			} catch (err) {
				// Continue to registration form if check fails
			} finally {
				setCheckingRegistration(false);
			}
		};

		checkRegistration();
	}, [address, isConnected, nav]);

	useEffect(() => {
		if (address) {
			setMentorAddress(address);
		}
	}, [address]);

	const handleConnectWallet = () => {
		if (connectors.length > 0) {
			connect({ connector: connectors[0] });
		}
	};

	const handleSwitchWallet = () => {
		disconnect();
		setTimeout(() => {
			if (connectors.length > 0) {
				connect({ connector: connectors[0] });
			}
		}, 100);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid) {
			return;
		}
		await registerMentor({
			username,
			mentorAddress: mentorAddress as `0x${string}`,
			fullName,
			bio,
			timezone,
		});
	};

	// Generate username from full name
	const generateUsernameFromFullName = (name: string) => {
		if (!name || name.trim().length === 0) return "";

		// Convert to snake_case
		const snakeCaseName = name
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, "") // Remove special characters
			.replace(/\s+/g, "_"); // Replace spaces with underscores

		// Add random number (4 digits)
		const randomNum = Math.floor(Math.random() * 9000) + 1000;

		return `${snakeCaseName}_${randomNum}`;
	};

	// Handle full name blur to auto-generate username
	const handleFullNameBlur = () => {
		if (fullName && !username) {
			const generatedUsername = generateUsernameFromFullName(fullName);
			setUsername(generatedUsername);
		}
	};

	return (
		<div className="container max-w-2xl mx-auto py-12 px-4">
			<div className="mb-8">
				<Badge className="mb-4 px-3 py-1.5 font-bold">
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

			<NetworkSwitchPrompt />

			{checkingRegistration && (
				<Card className="mt-6">
					<CardContent className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
							<p className="text-muted-foreground">Checking registration status...</p>
						</div>
					</CardContent>
				</Card>
			)}

			{!checkingRegistration && (
				<Card>
				<CardHeader>
					<CardTitle>Mentor Information</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
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
								onBlur={handleFullNameBlur}
								required
							/>
							<p className="text-xs text-muted-foreground">
								Username will be auto-generated from your full name
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<p className="text-sm text-muted-foreground">
								Use letters, numbers, and underscores only
							</p>
							<Input
								id="username"
								type="text"
								placeholder="e.g., john_doe_1234"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
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
							<Label htmlFor="address">Mentor Address</Label>
							<p className="text-sm text-muted-foreground">
								Automatically populated from your connected wallet
							</p>
							<div className="flex gap-2">
								<Input
									id="address"
									type="text"
									value={mentorAddress}
									disabled
									required
									className="flex-1 bg-muted"
								/>
								{!isConnected ? (
									<Button
										type="button"
										variant="outline"
										onClick={handleConnectWallet}
										disabled={isConnecting}
									>
										{isConnecting ? "Connecting..." : "Connect Wallet"}
									</Button>
								) : (
									<Button
										type="button"
										variant="outline"
										onClick={handleSwitchWallet}
										disabled={isLoading}
									>
										Switch Wallet
									</Button>
								)}
							</div>
						</div>

						{error && (
							<div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
								{error}
							</div>
						)}

						<Button
							type="submit"
							className="w-full"
							size="lg"
							disabled={isLoading || !isFormValid}
						>
							{isLoading ? "Registering..." : "Register as Mentor"}
						</Button>
					</form>
				</CardContent>
			</Card>
			)}
		</div>
	);
}
