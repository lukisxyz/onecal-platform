import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";
import { transactionStatuses } from "@/db/schemas";

type WebhookPayload = {
  id: string;
  event: string;
  payload: {
    payload_type: string;
    id: string;
    hash: string;
    status: string;
    status_reason: string | null;
    created_at: string;
    sent_at: string | null;
    confirmed_at: string | null;
    gas_price: string | null;
    gas_limit: number;
    nonce: number;
    value: string;
    from: string;
    to: string;
    relayer_id: string;
    data: string;
    max_fee_per_gas: string;
    max_priority_fee_per_gas: string;
    speed: string;
  };
  timestamp: string;
};

export const Route = createFileRoute("/api/relayer/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const bodyText = await request.text();

          // Parse and store webhook data
          try {
            const webhookData = JSON.parse(bodyText) as WebhookPayload;

            // Only process transaction_update events
            if (
              webhookData.event === "transaction_update" &&
              webhookData.payload
            ) {
              const payload = webhookData.payload;

              // Parse timestamps
              const parseTimestamp = (timestamp: string | null) =>
                timestamp ? new Date(timestamp) : null;

              // Insert or update transaction status
              await db
                .insert(transactionStatuses)
                .values({
                  id: webhookData.id,
                  transactionId: payload.id,
                  hash: payload.hash,
                  status: payload.status,
                  createdAt: parseTimestamp(payload.created_at),
                  sentAt: parseTimestamp(payload.sent_at),
                  confirmedAt: parseTimestamp(payload.confirmed_at),
                  gasPrice: payload.gas_price,
                  gasLimit: payload.gas_limit,
                  nonce: payload.nonce,
                  value: payload.value,
                  from: payload.from,
                  to: payload.to,
                  relayerId: payload.relayer_id,
                  data: payload.data,
                  maxFeePerGas: payload.max_fee_per_gas,
                  maxPriorityFeePerGas: payload.max_priority_fee_per_gas,
                  speed: payload.speed,
                  statusReason: payload.status_reason,
                  eventTimestamp: new Date(webhookData.timestamp),
                })
                .onConflictDoUpdate({
                  target: transactionStatuses.id,
                  set: {
                    status: payload.status,
                    sentAt: parseTimestamp(payload.sent_at),
                    confirmedAt: parseTimestamp(payload.confirmed_at),
                    eventTimestamp: new Date(webhookData.timestamp),
                  },
                });
            }
          } catch (parseError) {
            // Silently ignore parse errors
          }

          return Response.json({
            success: true,
            message: "Webhook received and processed",
          });
        } catch (err: unknown) {
          return new Response(
            JSON.stringify({ error: "Failed to process webhook" }),
            { status: 500 },
          );
        }
      },
    },
  },
});
