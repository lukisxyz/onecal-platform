import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
	component: Index,
	head: () => ({
		title: "Home - 0xCAL",
		meta: [],
	}),
});

function GetStartedButton() {
	const navigate = useNavigate();

	return (
		<Button
			size="lg"
			className="w-full sm:w-auto text-lg rounded-full px-6 py-4 md:px-12 md:py-7 font-semibold min-h-12 touch-manipulation"
			onClick={() => {
				navigate({ to: "/mentor/register" });
			}}
		>
			Get Started
		</Button>
	);
}

function Index() {
	return (
		<div className="min-h-screen">
			{/* Skip to content link for accessibility */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
			>
				Skip to main content
			</a>

			{/* Hero Section */}
			<section
				id="hero"
				className="min-h-screen flex items-center justify-center px-4 py-12 md:py-20"
				aria-labelledby="hero-heading"
			>
				<div className="container max-w-4xl mx-auto text-center">
					{/* Logo */}
					<div className="mb-6 md:mb-8">
						<Badge
							variant="secondary"
							className="text-sm md:text-lg px-3 py-1.5 md:px-4 md:py-2 font-bold text-white bg-black"
						>
							0xCAL
						</Badge>
					</div>

					{/* Main Headline */}
					<h1
						id="hero-heading"
						className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-foreground mb-4 md:mb-6 leading-tight"
					>
						High-Intent Scheduling <br /> Prevent{" "}
						<span className="text-blue-700">No-Shows</span>
					</h1>

					{/* Subheadline */}
					<p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
						0xCAL helps mentors, consultants, and professionals secure bookings
						with commitment fees to prevent no-shows, so every session is backed
						by real intent
					</p>

					<div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-8 md:mb-12 px-4 justify-center">
						<GetStartedButton />
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground">
						Professional scheduling with real commitment.
					</p>

					{/* Hero Visual Placeholder */}
					<div
						className="bg-secondary border-2 border-dashed border-border rounded-lg p-6 sm:p-8 md:p-12 lg:p-20"
						role="img"
						aria-label="0xCAL dashboard preview placeholder"
					>
						<div className="flex flex-col items-center justify-center gap-4">
							<div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
								<svg
									className="w-8 h-8 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<p className="text-muted-foreground text-sm font-medium">
								0xCAL Dashboard Preview
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main id="main-content">
				{/* Features Section */}
				<section
					className="py-12 md:py-20 px-4 bg-secondary/30"
					aria-labelledby="features-heading"
				>
					<div className="container max-w-6xl mx-auto">
						{/* Section Header */}
						<div className="text-center mb-8 md:mb-16">
							<h2
								id="features-heading"
								className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4"
							>
								Why Choose 0xCAL
							</h2>
							<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
								Built for mentors and consultants who value their time
							</p>
						</div>

						{/* Feature Cards Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
							{/* Feature 1: IDRX Payments */}
							<Card className="border-2 hover:border-primary/50 transition-colors duration-200 touch-manipulation">
								<CardHeader className="pb-3 md:pb-4">
									<div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 md:mb-4">
										<svg
											className="w-5 h-5 md:w-6 md:h-6 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
											/>
										</svg>
									</div>
									<CardTitle className="text-lg md:text-xl lg:text-2xl">
										Payment with IDRX Stablecoin
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<CardDescription className="text-sm md:text-base text-muted-foreground">
										Receive payments securely in IDRX. No volatile crypto
										surprises - just stable value for your time.
									</CardDescription>
								</CardContent>
							</Card>

							{/* Feature 2: Zero Gas Fees */}
							<Card className="border-2 hover:border-primary/50 transition-colors duration-200 touch-manipulation">
								<CardHeader className="pb-3 md:pb-4">
									<div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 md:mb-4">
										<svg
											className="w-5 h-5 md:w-6 md:h-6 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
									</div>
									<CardTitle className="text-lg md:text-xl lg:text-2xl">
										Zero Gas Fees
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<CardDescription className="text-sm md:text-base text-muted-foreground">
										Meta-transaction technology handles all blockchain
										complexity. You focus on mentoring, not gas fees.
									</CardDescription>
								</CardContent>
							</Card>

							{/* Feature 3: Guaranteed Attendance */}
							<Card className="border-2 hover:border-primary/50 transition-colors duration-200 touch-manipulation">
								<CardHeader className="pb-3 md:pb-4">
									<div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 md:mb-4">
										<svg
											className="w-5 h-5 md:w-6 md:h-6 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										</svg>
									</div>
									<CardTitle className="text-lg md:text-xl lg:text-2xl">
										Guaranteed Attendance
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<CardDescription className="text-sm md:text-base text-muted-foreground">
										Commitment fee system dramatically reduces no-shows. Both
										parties have skin in the game.
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Highlight Section with White Text on Dark Background */}
				<section className="py-12 md:py-20 px-4 bg-black">
					<div className="container max-w-4xl mx-auto text-center">
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-white">
							Transform Your Scheduling Experience
						</h2>
						<p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 font-medium">
							Stop losing time to no-shows. Start with confidence.
						</p>
						<div className="flex flex-wrap justify-center gap-3 md:gap-4">
							<Badge
								variant="outline"
								className="text-sm md:text-base px-4 py-2 border-white/30 text-white hover:bg-white/10 transition-colors"
							>
								✓ Zero Cancellation Fees
							</Badge>
							<Badge
								variant="outline"
								className="text-sm md:text-base px-4 py-2 border-white/30 text-white hover:bg-white/10 transition-colors"
							>
								✓ Instant IDRX Payments
							</Badge>
							<Badge
								variant="outline"
								className="text-sm md:text-base px-4 py-2 border-white/30 text-white hover:bg-white/10 transition-colors"
							>
								✓ Blockchain Secure
							</Badge>
						</div>
					</div>
				</section>

				<section className="py-12 md:py-20 px-4" aria-labelledby="cta-heading">
					<div className="container max-w-4xl mx-auto text-center px-4">
						<h2
							id="cta-heading"
							className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 md:mb-6"
						>
							Ready to Eliminate No-Shows?
						</h2>
						<p className="text-base sm:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
							Join mentors and consultants who trust 0xCAL to manage their
							sessions
						</p>
						<GetStartedButton />
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="py-8 md:py-12 px-4 bg-background border-t border-border">
				<div className="container max-w-6xl mx-auto">
					<h2 id="footer-heading" className="sr-only">
						Footer Navigation
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
						{/* Brand Section */}
						<div className="text-center md:text-left">
							<p className="text-base font-bold">0xCAL</p>
							<p className="text-xs sm:text-sm text-muted-foreground">
								Blockchain-powered calendar <br /> for mentors and consultants
							</p>
						</div>

						{/* Features */}
						<div className="text-center md:text-left">
							<h3 className="text-sm font-semibold text-foreground mb-3">
								Features
							</h3>
							<ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
								<li>IDRX Stablecoin Payments</li>
								<li>Zero Gas Fees</li>
								<li>Commitment Fee System</li>
								<li>Blockchain Calendar</li>
							</ul>
						</div>

						{/* Legal */}
						<div className="text-center md:text-left">
							<h3 className="text-sm font-semibold text-foreground mb-3">
								Legal
							</h3>
							<ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
								<li>
									<a
										href="/privacy"
										className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="/terms"
										className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
									>
										Terms of Service
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Copyright */}
					<div className="pt-6 md:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
						<p>&copy; {new Date().getFullYear()} 0xCAL. All rights reserved.</p>
					</div>
				</div>
			</footer>

			{/* Back to top link for accessibility */}
			<a
				href="#hero"
				className="sr-only focus:not-sr-only focus:absolute focus:bottom-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
			>
				Back to top
			</a>
		</div>
	);
}
