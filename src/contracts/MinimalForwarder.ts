export const MinimalForwarderABI = [
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "req",
        "type": "tuple",
        "internalType": "struct MinimalForwarder.ForwardRequest",
        "components": [
          { "name": "from", "type": "address", "internalType": "address" },
          { "name": "to", "type": "address", "internalType": "address" },
          { "name": "value", "type": "uint256", "internalType": "uint256" },
          { "name": "gas", "type": "uint256", "internalType": "uint256" },
          { "name": "nonce", "type": "uint256", "internalType": "uint256" },
          { "name": "data", "type": "bytes", "internalType": "bytes" },
          { "name": "deadline", "type": "uint256", "internalType": "uint256" }
        ]
      },
      { "name": "signature", "type": "bytes", "internalType": "bytes" }
    ],
    "outputs": [
      { "name": "success", "type": "bool", "internalType": "bool" },
      { "name": "returnData", "type": "bytes", "internalType": "bytes" }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDomainSeparator",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [{ "name": "from", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nonces",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ExecutedForwardRequest",
    "inputs": [
      { "name": "from", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "to", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "success", "type": "bool", "indexed": false, "internalType": "bool" },
      { "name": "returnData", "type": "bytes", "indexed": false, "internalType": "bytes" }
    ],
    "anonymous": false
  },
  { "type": "error", "name": "DeadlineExceeded", "inputs": [] },
  { "type": "error", "name": "ForwardCallFailed", "inputs": [] },
  { "type": "error", "name": "ReplayAttack", "inputs": [] }
] as const;
