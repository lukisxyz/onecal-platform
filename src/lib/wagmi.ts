import { type Config, createConfig, http } from "@wagmi/core";
import { createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const chain = baseSepolia;

export const config = createConfig({
	chains: [chain],
	connectors: [
		coinbaseWallet({
			appName: "0xCAL",
			preference: "eoaOnly",
			version: "4",
		}),
		injected(),
	],
	ssr: true,
	transports: {
		[chain.id]: http(),
	},
}) as Config;

export const publicClient = createPublicClient({
	chain,
	transport: http(),
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
