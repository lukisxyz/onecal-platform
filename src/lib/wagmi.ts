import { type Config, createConfig, http } from "@wagmi/core";
import { anvil } from "viem/chains";
import { injected } from "wagmi/connectors";

export const chain = anvil;

export const config = createConfig({
	chains: [chain],
	connectors: [
		/*coinbaseWallet({
      appName: "0xCAL",
      preference: "smartWalletOnly",
      version: "4",
    }),*/
		injected(),
	],
	ssr: true,
	transports: {
		[chain.id]: http(),
	},
}) as Config;

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
