import type { Address } from "viem";
import { MENTOR_REGISTRY_ADDRESS } from "@/contracts";
import { chain } from "./wagmi";

export const domain = {
	name: "MentorRegistry",
	version: "1",
	chainId: chain.id,
	verifyingContract: MENTOR_REGISTRY_ADDRESS,
} as const;

export const mentorRegisterTypes = {
	MentorRegister: [
		{ name: "username", type: "string" },
		{ name: "creatorAddress", type: "address" },
		{ name: "nonce", type: "uint256" },
		{ name: "deadline", type: "uint256" },
	],
} as const;

export const mentorAddressUpdateTypes = {
	MentorAddressUpdate: [
		{ name: "username", type: "string" },
		{ name: "newAddress", type: "address" },
		{ name: "nonce", type: "uint256" },
		{ name: "deadline", type: "uint256" },
	],
} as const;

export type MentorRegister = {
	username: string;
	creatorAddress: Address;
	nonce: bigint;
	deadline: bigint;
};

export type MentorAddressUpdate = {
	username: string;
	newAddress: Address;
	nonce: bigint;
	deadline: bigint;
};
