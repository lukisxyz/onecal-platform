import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { TransactionStatusDisplay } from "@/components/transaction-status-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/mentor/registered")({
	component: MentorRegistered,
	head: () => ({
		title: "Registration Successful - 0xCAL",
		meta: [
			{
				name: "description",
				content: "Your mentor registration has been submitted successfully",
			},
		],
	}),
});

function MentorRegistered() {
	const routerState = useRouterState();
	const search = routerState?.location?.search ?? window.location.search;
	const tx = new URLSearchParams(search).get("tx");

	return (
		<div className="container max-w-4xl mx-auto py-12 px-4">
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-4">
					<CheckCircle2 className="h-8 w-8 text-green-600" />
					<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
						Registration Submitted
					</h1>
				</div>
				<p className="text-lg text-muted-foreground">
					Your mentor registration has been submitted to the blockchain. Track
					the transaction status below.
				</p>
			</div>

			<div className="space-y-6">
				{tx ? (
					<TransactionStatusDisplay hash={tx} showHistory={true} />
				) : (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center py-8 text-muted-foreground">
								No transaction hash provided
							</div>
						</CardContent>
					</Card>
				)}

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">What's Next?</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
									1
								</div>
								<div>
									<div className="font-medium">Transaction Confirmation</div>
									<div className="text-sm text-muted-foreground">
										Wait for the transaction to be confirmed on the blockchain
									</div>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
									2
								</div>
								<div>
									<div className="font-medium">Profile Activation</div>
									<div className="text-sm text-muted-foreground">
										Once confirmed, your mentor profile will be activated
									</div>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
									3
								</div>
								<div>
									<div className="font-medium">Start Earning</div>
									<div className="text-sm text-muted-foreground">
										Begin receiving mentees and earning IDRX
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-4">
					<Button asChild variant="outline">
						<Link to="/">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Home
						</Link>
					</Button>
					<Button asChild>
						<Link to="/mentor/register">Register Another Mentor</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
