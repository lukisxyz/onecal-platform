import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { anvil, base, baseSepolia } from "wagmi/chains";
import { getConfig } from "@/lib/wagmi";

const chains = {
	local: anvil,
	development: baseSepolia,
	production: base,
};

type NodeEnv = keyof typeof chains;

const getNodeEnv = (): NodeEnv => {
	if (typeof window !== "undefined") {
		const localStorageEnv = window.localStorage.getItem("NODE_ENV") as NodeEnv;
		if (localStorageEnv && localStorageEnv in chains) {
			return localStorageEnv;
		}
	}
	const env = import.meta.env.VITE_NODE_ENV || process.env.NODE_ENV;
	if (env && env in chains) {
		return env as NodeEnv;
	}
	return "development";
};

const nodeEnv = getNodeEnv();
const primaryChain = chains[nodeEnv];

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
