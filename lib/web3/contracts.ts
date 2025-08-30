export const VALIDATION_REGISTRY_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "_dataHash", type: "bytes32" },
      { internalType: "bytes32", name: "_proofHash", type: "bytes32" },
      { internalType: "string", name: "_ruleSetId", type: "string" },
      { internalType: "bool", name: "_isValid", type: "bool" },
      { internalType: "string", name: "_metadata", type: "string" },
    ],
    name: "submitValidation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_proofHash", type: "bytes32" }],
    name: "getValidationProof",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "dataHash", type: "bytes32" },
          { internalType: "bytes32", name: "proofHash", type: "bytes32" },
          { internalType: "address", name: "validator", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "ruleSetId", type: "string" },
          { internalType: "bool", name: "isValid", type: "bool" },
          { internalType: "string", name: "metadata", type: "string" },
        ],
        internalType: "struct ValidationRegistry.ValidationProof",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "authorizedValidators",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProofCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export const RULESET_MANAGER_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_id", type: "string" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint8", name: "_validationType", type: "uint8" },
    ],
    name: "createRuleSetConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "ruleSetConfigs",
    outputs: [
      { internalType: "string", name: "id", type: "string" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint8", name: "validationType", type: "uint8" },
      { internalType: "bool", name: "isActive", type: "bool" },
      { internalType: "uint256", name: "createdAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "_validationType", type: "uint8" }],
    name: "getRuleSetsByType",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const
