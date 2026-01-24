import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { getConfig } from "@/lib/wagmi";

const isDevelopment = import.meta.env.DEV;
const isLocal = import.meta.env.MODE === "local";

const primaryChain = isLocal ? baseSepolia : isDevelopment ? baseSepolia : base;

export function getContext() {
	const [config] = useState(() => getConfig());
	return {
		config,
	};
}

export function Providers({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState?: State;
}) {
	const [config] = useState(() => getConfig());
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
					chain={primaryChain}
				>
					{children}
				</OnchainKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
