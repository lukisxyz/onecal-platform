export const MENTOR_REGISTRY_ABI = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [],
		name: "AddressAlreadyExists",
		type: "error",
	},
	{
		inputs: [],
		name: "DeadlineExceeded",
		type: "error",
	},
	{
		inputs: [],
		name: "ECDSAInvalidSignature",
		type: "error",
	},
	{
		inputs: [
			{
				name: "length",
				type: "uint256",
			},
		],
		name: "ECDSAInvalidSignatureLength",
		type: "error",
	},
	{
		inputs: [
			{
				name: "s",
				type: "bytes32",
			},
		],
		name: "ECDSAInvalidSignatureS",
		type: "error",
	},
	{
		inputs: [],
		name: "EmptyUsername",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidShortString",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidSignature",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidUsernameFormat",
		type: "error",
	},
	{
		inputs: [],
		name: "MentorDoesNotExist",
		type: "error",
	},
	{
		inputs: [],
		name: "NonceMismatch",
		type: "error",
	},
	{
		inputs: [
			{
				name: "str",
				type: "string",
			},
		],
		name: "StringTooLong",
		type: "error",
	},
	{
		inputs: [],
		name: "Unauthorized",
		type: "error",
	},
	{
		inputs: [],
		name: "UsernameAlreadyExists",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "username",
				type: "string",
			},
			{
				indexed: true,
				name: "oldAddress",
				type: "address",
			},
			{
				indexed: true,
				name: "newAddress",
				type: "address",
			},
		],
		name: "AddressUpdated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "username",
				type: "string",
			},
			{
				indexed: true,
				name: "oldAddress",
				type: "address",
			},
			{
				indexed: true,
				name: "newAddress",
				type: "address",
			},
			{
				indexed: false,
				name: "relayer",
				type: "address",
			},
		],
		name: "AddressUpdatedByRelayer",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [],
		name: "EIP712DomainChanged",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "username",
				type: "string",
			},
			{
				indexed: true,
				name: "mentorAddress",
				type: "address",
			},
		],
		name: "MentorRegistered",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "username",
				type: "string",
			},
			{
				indexed: true,
				name: "mentorAddress",
				type: "address",
			},
			{
				indexed: false,
				name: "relayer",
				type: "address",
			},
		],
		name: "MentorRegisteredByRelayer",
		type: "event",
	},
	{
		inputs: [],
		name: "ADDRESS_UPDATE_TYPEHASH",
		outputs: [
			{
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "MENTOR_REGISTER_TYPEHASH",
		outputs: [
			{
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "eip712Domain",
		outputs: [
			{
				name: "fields",
				type: "bytes1",
			},
			{
				name: "name",
				type: "string",
			},
			{
				name: "version",
				type: "string",
			},
			{
				name: "chainId",
				type: "uint256",
			},
			{
				name: "verifyingContract",
				type: "address",
			},
			{
				name: "salt",
				type: "bytes32",
			},
			{
				name: "extensions",
				type: "uint256[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "_username",
				type: "string",
			},
		],
		name: "getMentor",
		outputs: [
			{
				name: "username",
				type: "string",
			},
			{
				name: "currentAddress",
				type: "address",
			},
			{
				name: "exists",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "_mentorAddress",
				type: "address",
			},
		],
		name: "getMentorByAddress",
		outputs: [
			{
				name: "username",
				type: "string",
			},
			{
				name: "mentorAddr",
				type: "address",
			},
			{
				name: "exists",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "_address",
				type: "address",
			},
		],
		name: "getNonce",
		outputs: [
			{
				name: "nonce",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "addresses",
				type: "address[]",
			},
		],
		name: "getNonces",
		outputs: [
			{
				name: "",
				type: "uint256[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "",
				type: "address",
			},
		],
		name: "mentorAddressToUsername",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "",
				type: "string",
			},
		],
		name: "mentors",
		outputs: [
			{
				name: "username",
				type: "string",
			},
			{
				name: "currentAddress",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "",
				type: "address",
			},
		],
		name: "nonces",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "_username",
				type: "string",
			},
			{
				name: "_mentorAddress",
				type: "address",
			},
		],
		name: "registerMentor",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "_username",
				type: "string",
			},
			{
				name: "_mentorAddress",
				type: "address",
			},
			{
				name: "_deadline",
				type: "uint256",
			},
			{
				name: "_v",
				type: "uint8",
			},
			{
				name: "_r",
				type: "bytes32",
			},
			{
				name: "_s",
				type: "bytes32",
			},
		],
		name: "registerMentorByRelayer",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "_username",
				type: "string",
			},
			{
				name: "_newAddress",
				type: "address",
			},
		],
		name: "updateAddress",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "_username",
				type: "string",
			},
			{
				name: "_newAddress",
				type: "address",
			},
			{
				name: "_deadline",
				type: "uint256",
			},
			{
				name: "_v",
				type: "uint8",
			},
			{
				name: "_r",
				type: "bytes32",
			},
			{
				name: "_s",
				type: "bytes32",
			},
		],
		name: "updateAddressByRelayer",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "_username",
				type: "string",
			},
		],
		name: "usernameExists",
		outputs: [
			{
				name: "exists",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];
