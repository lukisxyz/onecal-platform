import {
	type ApiResponseTransactionResponseData,
	type EvmTransactionResponse,
	type NetworkTransactionRequest,
	Speed,
} from "@openzeppelin/relayer-sdk";
import { createFileRoute } from "@tanstack/react-router";
import { MENTOR_REGISTRY_ADDRESS } from "@/lib/constants";
import { relayerId, relayersApi } from "@/lib/relayer.server";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Route = createFileRoute("/api/mentor/register")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const { data } = await request.json();

					const networkTransaction: NetworkTransactionRequest = {
						to: MENTOR_REGISTRY_ADDRESS,
						data,
						speed: Speed.FAST,
						gas_limit: 300_000,
						value: 0,
					};

					const sendTxRes = await relayersApi.sendTransaction(
						relayerId,
						networkTransaction,
					);

					const { id: txId } = sendTxRes.data
						.data as ApiResponseTransactionResponseData;
					let hash: string | null = null;
					let resData: ApiResponseTransactionResponseData | null = null;

					for (let attempt = 0; attempt < 3; attempt++) {
						const txStatusRes = await relayersApi.getTransactionById(
							relayerId,
							txId,
						);
						const txData = txStatusRes.data
							.data as EvmTransactionResponse;

						if (txData.hash) {
							hash = txData.hash;
							resData = txData;
							break;
						}

						await delay(1000 * 2 ** attempt);
					}

					if (!resData) {
						const finalTxRes = await relayersApi.getTransactionById(
							relayerId,
							txId,
						);
						resData = finalTxRes.data
							.data as ApiResponseTransactionResponseData;
					}

					const { status, confirmed_at, created_at } = resData;

					return Response.json({
						id: hash,
						txId,
						status,
						confirmed_at,
						created_at,
					});
				} catch (_err: unknown) {
					return new Response(
						JSON.stringify({ error: "Failed to register mentor" }),
						{ status: 500 },
					);
				}
			},
		},
	},
});
