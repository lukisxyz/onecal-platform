import { createPublicClient } from "viem";
import { anvil, base, baseSepolia } from "viem/chains";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

export function getConfig() {
	return createConfig({
		chains: [anvil, baseSepolia, base],
		connectors: [
			coinbaseWallet({
				appName: "0xCAL",
				preference: "smartWalletOnly",
				version: "4",
			}),
			metaMask(),
		],
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		transports: {
			[anvil.id]: http(),
			[baseSepolia.id]: http(),
			[base.id]: http(),
		},
	});
}

export const config = getConfig();

export const publicClient = createPublicClient({
	chain: anvil,
	transport: http(),
});

declare module "wagmi" {
	interface Register {
		config: ReturnType<typeof getConfig>;
	}
}
