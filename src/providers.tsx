import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { chain, config } from "@/lib/wagmi";
export function Providers({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState?: State;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			}),
	);

	return (
		<WagmiProvider config={config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				<OnchainKitProvider
					projectId={import.meta.env.VITE_ONCHAINKIT_PROJECT_ID}
					apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
					chain={chain}
				>
					{children}
				</OnchainKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
