import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";
import { transactionStatuses } from "@/db/schemas";
import { eq, desc, and } from "drizzle-orm";

export const Route = createFileRoute("/api/transaction/status")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const url = new URL(request.url);
					const hash = url.searchParams.get("hash");
					const transactionId = url.searchParams.get("transactionId");

					if (!hash && !transactionId) {
						return new Response(
							JSON.stringify({
								error: "Either 'hash' or 'transactionId' query parameter is required",
							}),
							{ status: 400 },
						);
					}

					let statuses;

					if (hash) {
						// Query by transaction hash
						statuses = await db
							.select()
							.from(transactionStatuses)
							.where(eq(transactionStatuses.hash, hash))
							.orderBy(desc(transactionStatuses.eventTimestamp));
					} else {
						// Query by transaction ID
						statuses = await db
							.select()
							.from(transactionStatuses)
							.where(eq(transactionStatuses.transactionId, transactionId!))
							.orderBy(desc(transactionStatuses.eventTimestamp));
					}

					// Transform dates to ISO strings for JSON serialization
					const transformStatus = (status: any) => ({
						...status,
						createdAt: status.createdAt ? new Date(status.createdAt).toISOString() : null,
						sentAt: status.sentAt ? new Date(status.sentAt).toISOString() : null,
						confirmedAt: status.confirmedAt ? new Date(status.confirmedAt).toISOString() : null,
						eventTimestamp: status.eventTimestamp ? new Date(status.eventTimestamp).toISOString() : null,
					});

					// Return latest status and history
					const latest = statuses[0] ? transformStatus(statuses[0]) : null;
					const history = statuses.map(transformStatus);

					return Response.json({
						success: true,
						latest,
						history,
						count: statuses.length,
					});
				} catch (err: unknown) {
					console.error("Get transaction status error:", err);
					return new Response(
						JSON.stringify({ error: "Failed to get transaction status" }),
						{ status: 500 },
					);
				}
			},
		},
	},
});
