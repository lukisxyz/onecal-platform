import type { Address } from "viem";
import { MINIMAL_FORWARDER_ADDRESS } from "@/contracts/contract-address";
import { chain } from "./wagmi";
export { MENTOR_REGISTRY_ADDRESS } from "@/contracts/contract-address";

export const domain = {
	name: "MentorRegistry",
	version: "1",
	chainId: chain.id,
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
