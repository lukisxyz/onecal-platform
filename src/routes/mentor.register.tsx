import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
	const onSubmit = () => {
		// Empty function - no functionality needed
		console.log("onSubmit called with empty data");
	};

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
				</CardHeader>
				<CardContent>
					<Button onClick={onSubmit} className="w-full" size="lg">
						Register as Mentor
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
