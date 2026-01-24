import type { Address } from "viem";
import { MINIMAL_FORWARDER_ADDRESS } from "~/contracts/contract-address";
import { mentorRegistryAbi } from "~/contracts/MentorRegistry";

export const MENTOR_REGISTRY_ABI = mentorRegistryAbi as const;
export { MENTOR_REGISTRY_ADDRESS } from "~/contracts/contract-address";

export const MINIMAL_FORWARDER_ABI = [
	{
		type: "function",
		name: "getNonce",
		inputs: [{ name: "from", type: "address" }],
		outputs: [{ name: "nonce", type: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "execute",
		inputs: [
			{
				name: "request",
				type: "tuple",
				components: [
					{ name: "from", type: "address" },
					{ name: "to", type: "address" },
					{ name: "value", type: "uint256" },
					{ name: "gas", type: "uint256" },
					{ name: "nonce", type: "uint256" },
					{ name: "data", type: "bytes" },
				],
			},
			{ name: "signature", type: "bytes" },
		],
		outputs: [
			{ name: "success", type: "bool" },
			{ name: "ret", type: "bytes" },
		],
		stateMutability: "payable",
	},
] as const;

export const domain = {
	name: "MentorRegistry",
	version: "1",
	chainId: 31337,
	verifyingContract: MINIMAL_FORWARDER_ADDRESS,
} as const;

export const mentorRegisterTypes = {
	MentorRegister: [
		{ name: "username", type: "string" },
		{ name: "mentorAddress", type: "address" },
		{ name: "nonce", type: "uint256" },
	],
} as const;

export const mentorAddressUpdateTypes = {
	MentorAddressUpdate: [
		{ name: "username", type: "string" },
		{ name: "newAddress", type: "address" },
		{ name: "nonce", type: "uint256" },
	],
} as const;

export type MentorRegister = {
	username: string;
	mentorAddress: Address;
	nonce: bigint;
};

export type MentorAddressUpdate = {
	username: string;
	newAddress: Address;
	nonce: bigint;
};
