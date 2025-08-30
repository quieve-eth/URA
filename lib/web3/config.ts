import { http, createConfig } from "wagmi"
import { mainnet, sepolia, hardhat } from "wagmi/chains"
import { injected, metaMask } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [injected(), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
})

export const VALIDATION_REGISTRY_ADDRESS = {
  [mainnet.id]: "0x0000000000000000000000000000000000000000", // Placeholder
  [sepolia.id]: "0x0000000000000000000000000000000000000000", // Placeholder
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Local deployment
} as const

export const RULESET_MANAGER_ADDRESS = {
  [mainnet.id]: "0x0000000000000000000000000000000000000000", // Placeholder
  [sepolia.id]: "0x0000000000000000000000000000000000000000", // Placeholder
  [hardhat.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Local deployment
} as const
