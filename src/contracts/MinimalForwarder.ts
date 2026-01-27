export const MINIMAL_FORWARDER_ABI = [
	{
		type: "constructor",
		inputs: [],
		stateMutability: "nonpayable",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				name: "nonce",
				type: "uint256",
			},
			{
				indexed: false,
				name: "success",
				type: "bool",
			},
			{
				indexed: false,
				name: "returnData",
				type: "bytes",
			},
		],
		name: "MetaTransactionExecuted",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "from",
				type: "address",
			},
			{
				indexed: false,
				name: "newNonce",
				type: "uint256",
			},
		],
		name: "NonceIncremented",
		type: "event",
	},
	{
		inputs: [],
		name: "DOMAIN_SEPARATOR",
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
		inputs: [
			{
				name: "req",
				type: "tuple",
				components: [
					{
						name: "from",
						type: "address",
					},
					{
						name: "to",
						type: "address",
					},
					{
						name: "value",
						type: "uint256",
					},
					{
						name: "gas",
						type: "uint256",
					},
					{
						name: "nonce",
						type: "uint256",
					},
					{
						name: "data",
						type: "bytes",
					},
					{
						name: "deadline",
						type: "uint256",
					},
				],
			},
			{
				name: "signature",
				type: "bytes",
			},
		],
		name: "execute",
		outputs: [
			{
				name: "",
				type: "bool",
			},
			{
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "requests",
				type: "tuple[]",
				components: [
					{
						name: "from",
						type: "address",
					},
					{
						name: "to",
						type: "address",
					},
					{
						name: "value",
						type: "uint256",
					},
					{
						name: "gas",
						type: "uint256",
					},
					{
						name: "nonce",
						type: "uint256",
					},
					{
						name: "data",
						type: "bytes",
					},
					{
						name: "deadline",
						type: "uint256",
					},
				],
			},
			{
				name: "signatures",
				type: "bytes[]",
			},
		],
		name: "executeBatch",
		outputs: [
			{
				name: "successes",
				type: "bool[]",
			},
			{
				name: "results",
				type: "bytes[]",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "from",
				type: "address",
			},
		],
		name: "getNonce",
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
		inputs: [],
		name: "incrementNonce",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "req",
				type: "tuple",
				components: [
					{
						name: "from",
						type: "address",
					},
					{
						name: "to",
						type: "address",
					},
					{
						name: "value",
						type: "uint256",
					},
					{
						name: "gas",
						type: "uint256",
					},
					{
						name: "nonce",
						type: "uint256",
					},
					{
						name: "data",
						type: "bytes",
					},
					{
						name: "deadline",
						type: "uint256",
					},
				],
			},
		],
		name: "isExecuted",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				name: "req",
				type: "tuple",
				components: [
					{
						name: "from",
						type: "address",
					},
					{
						name: "to",
						type: "address",
					},
					{
						name: "value",
						type: "uint256",
					},
					{
						name: "gas",
						type: "uint256",
					},
					{
						name: "nonce",
						type: "uint256",
					},
					{
						name: "data",
						type: "bytes",
					},
					{
						name: "deadline",
						type: "uint256",
					},
				],
			},
			{
				name: "signature",
				type: "bytes",
			},
		],
		name: "verify",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
] as const;
