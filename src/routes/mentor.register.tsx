import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMentor } from "@/hooks/use-register-mentor";
import { NetworkSwitchPrompt } from "@/components/network-switch-prompt";

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
	const { address, isConnected } = useAccount();
	const { connect, connectors, isPending: isConnecting } = useConnect();

	const { registerMentor, isLoading, error } = useRegisterMentor();

	const isFormValid = username && mentorAddress && isConnected;

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid) {
			return;
		}
		await registerMentor({
			username,
			mentorAddress: mentorAddress as `0x${string}`,
		});
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

			<Card>
				<CardHeader>
					<CardTitle>Mentor Information</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
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
								{!isConnected && (
									<Button
										type="button"
										variant="outline"
										onClick={handleConnectWallet}
										disabled={isConnecting}
									>
										{isConnecting ? "Connecting..." : "Connect Wallet"}
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
		</div>
	);
}
