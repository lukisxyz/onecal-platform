import { Configuration, RelayersApi } from "@openzeppelin/relayer-sdk";

const config = new Configuration({
	basePath: process.env.VITE_RELAYER_URL || "http://localhost:8080",
	accessToken: process.env.VITE_RELAYER_API_KEY,
});

export const relayerId = process.env.RELAYER_ID || "local-anvil-relayer";
export const relayersApi = new RelayersApi(config);
