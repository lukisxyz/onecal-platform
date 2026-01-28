import { createFileRoute } from "@tanstack/react-router";
import { getMentorProfileByUsername } from "@/lib/mentor-profile.server";

export const Route = createFileRoute("/api/mentor-by-username/$username")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				try {
					const { username } = params;

					if (!username) {
						return new Response(
							JSON.stringify({ error: "Username is required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const profile = await getMentorProfileByUsername(username);

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
		},
	},
});
