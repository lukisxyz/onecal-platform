import { createFileRoute } from "@tanstack/react-router";
import {
	createMentorProfile,
	getMentorProfileByWallet,
	updateMentorProfile,
} from "@/lib/mentor-profile.server";

export const Route = createFileRoute("/api/mentor/$walletAddress")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				try {
					const { walletAddress } = params;

					if (!walletAddress) {
						return new Response(
							JSON.stringify({ error: "Wallet address is required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const profile = await getMentorProfileByWallet(walletAddress);

					if (!profile) {
						return new Response(
							JSON.stringify({ error: "Mentor profile not found" }),
							{
								status: 404,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					return Response.json({
						id: profile.id,
						username: profile.username,
						walletAddress: profile.walletAddress,
						fullName: profile.fullName,
						bio: profile.bio,
						timezone: profile.timezone,
						createdAt: profile.createdAt,
						updatedAt: profile.updatedAt,
					});
				} catch (err: unknown) {
					const errorMessage =
						err instanceof Error ? err.message : "Internal server error";

					return new Response(JSON.stringify({ error: errorMessage }), {
						status: 500,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
			PATCH: async ({ request, params }) => {
				try {
					const { walletAddress } = params;

					if (!walletAddress) {
						return new Response(
							JSON.stringify({ error: "Wallet address is required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const body = await request.json();
					const { fullName, bio, timezone, username } = body;

					if (!fullName || !timezone || !username) {
						return new Response(
							JSON.stringify({
								error: "Full name, timezone, and username are required",
							}),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Check if profile exists
					const existingProfile = await getMentorProfileByWallet(walletAddress);

					if (!existingProfile) {
						await createMentorProfile({
							username,
							walletAddress,
							fullName,
							bio,
							timezone,
						});
						return new Response(
							JSON.stringify({
								message: "Successfully save profile",
							}),
							{
								status: 201,
								headers: { "Content-Type": "application/json" },
							},
						);
					} else {
						await updateMentorProfile(walletAddress, username, {
							fullName,
							bio,
							timezone,
						});
						return new Response(
							JSON.stringify({
								message: "Successfully update profile",
							}),
							{
								status: 200,
								headers: { "Content-Type": "application/json" },
							},
						);
					}
				} catch (err: unknown) {
					const errorMessage =
						err instanceof Error ? err.message : "Internal server error";

					return new Response(JSON.stringify({ error: errorMessage }), {
						status: 500,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
		},
	},
});
