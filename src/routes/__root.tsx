import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
	useNavigate,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/providers";
import appCss from "../styles.css?url";

function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<h1 className="text-4xl font-bold">404 - Not Found</h1>
			<p className="text-muted-foreground">
				The page you're looking for doesn't exist.
			</p>
			<Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
		</div>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: NotFound,
	head: () => ({
		title: "0xCAL - Commitment-First Scheduling Platform",
		meta: [
			// Basic SEO
			{
				name: "description",
				content:
					"0xCAL helps mentors, consultants, and professionals secure bookings with commitment fees to prevent no-shows, so every session is backed by real intent",
			},
			{
				name: "keywords",
				content:
					"blockchain calendar, mentoring, consultation, IDRX, zero gas fees, commitment fees, smart contracts, scheduling platform",
			},
			{ name: "robots", content: "index, follow" },
			{ name: "author", content: "0xCAL" },
			{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
			{ name: "theme-color", content: "#000000" },
			{ name: "color-scheme", content: "light" },

			// Open Graph / Facebook
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:title",
				content: "0xCAL - Commitment-First Scheduling Platform",
			},
			{
				property: "og:description",
				content:
					"Stop losing time to no-shows. 0xCAL uses smart contracts and commitment fees to secure your sessions, ensuring every booking is backed by intent.",
			},
			{
				property: "og:site_name",
				content: "0xCAL",
			},
			{
				property: "og:url",
				content: "https://onecal.com",
			},
			{
				property: "og:image",
				content: "/og-image.png",
			},
			{
				property: "og:image:width",
				content: "1200",
			},
			{
				property: "og:image:height",
				content: "630",
			},
			{
				property: "og:image:alt",
				content: "0xCAL - Commitment-First Scheduling Platform",
			},
			{
				property: "og:locale",
				content: "en_US",
			},

			// Twitter Card
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "0xCAL - Commitment-First Scheduling Platform",
			},
			{
				name: "twitter:description",
				content:
					"Stop losing time to no-shows. 0xCAL uses smart contracts and commitment fees to secure your sessions, ensuring every booking is backed by intent.",
			},
			{
				name: "twitter:image",
				content: "/og-image.png",
			},
			{
				name: "twitter:image:alt",
				content: "0xCAL - Commitment-First Scheduling Platform",
			},

			// Accessibility & A11y
			{
				name: "application-name",
				content: "0xCAL",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "0xCAL",
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default",
			},
			{
				name: "format-detection",
				content: "telephone=no",
			},
			{
				name: "mobile-web-app-capable",
				content: "yes",
			},

			// Additional SEO
			{
				name: "DC.title",
				content: "0xCAL - Blockchain-Powered Calendar",
			},
			{
				name: "DC.creator",
				content: "0xCAL",
			},
			{
				name: "DC.subject",
				content: "Blockchain Calendar, Mentoring, Consultation",
			},
			{
				name: "DC.description",
				content:
					"0xCAL is a blockchain-powered calendar that eliminates no-shows with commitment fees.",
			},
			{
				name: "DC.publisher",
				content: "0xCAL",
			},
			{
				name: "DC.date",
				content: new Date().toISOString().split("T")[0],
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },

			// Favicons - from public folder
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "shortcut icon",
				href: "/favicon.ico",
			},

			// Apple Touch Icons - from public folder
			{
				rel: "apple-touch-icon",
				sizes: "57x57",
				href: "/apple-touch-icon-57x57.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "60x60",
				href: "/apple-touch-icon-60x60.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "72x72",
				href: "/apple-touch-icon-72x72.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "76x76",
				href: "/apple-touch-icon-76x76.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "114x114",
				href: "/apple-touch-icon-114x114.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "120x120",
				href: "/apple-touch-icon-120x120.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "144x144",
				href: "/apple-touch-icon-144x144.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "152x152",
				href: "/apple-touch-icon-152x152.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon-180x180.png",
			},

			// PWA Manifest
			{
				rel: "manifest",
				href: "/manifest.json",
			},

			// Microsoft Tiles
			{
				rel: "msapplication-TileImage",
				content: "/mstile-144x144.png",
			},
			{
				rel: "msapplication-TileColor",
				content: "#000000",
			},
			{
				rel: "msapplication-config",
				href: "/browserconfig.xml",
			},

			// Canonical URL
			{
				rel: "canonical",
				href: "https://onecal.com",
			},
		],
		scripts: [
			// Structured Data (JSON-LD) for SEO
			{
				type: "application/ld+json",
				innerHTML: JSON.stringify(
					{
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "0xCAL",
						url: "https://onecal.com",
						logo: "https://onecal.com/logo.png",
						description:
							"0xCAL is a blockchain-powered calendar that eliminates no-shows with commitment fees.",
						sameAs: [
							"https://twitter.com/onecal",
							"https://linkedin.com/company/onecal",
						],
						contactPoint: {
							"@type": "ContactPoint",
							contactType: "customer service",
							availableLanguage: "English",
						},
					},
					null,
					0,
				),
			},
			{
				type: "application/ld+json",
				innerHTML: JSON.stringify(
					{
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: "0xCAL",
						url: "https://onecal.com",
						potentialAction: {
							"@type": "SearchAction",
							target: "https://onecal.com/search?q={search_term_string}",
							"query-input": "required name=search_term_string",
						},
					},
					null,
					0,
				),
			},
			{
				type: "application/ld+json",
				innerHTML: JSON.stringify(
					{
						"@context": "https://schema.org",
						"@type": "WebApplication",
						name: "0xCAL",
						url: "https://onecal.com",
						description:
							"Blockchain-powered calendar that eliminates no-shows with commitment fees.",
						applicationCategory: "BusinessApplication",
						operatingSystem: "Web Browser",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD",
						},
						featureList: [
							"Payment with IDRX Stablecoin",
							"Zero Gas Fees",
							"Guaranteed Attendance",
							"Blockchain Calendar",
						],
					},
					null,
					0,
				),
			},
		],
	}),
});

function RootLayout() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Providers>
					<Outlet />
					<Toaster position="top-center" richColors />
				</Providers>
				<Scripts />
			</body>
		</html>
	);
}
