import { ethers } from "ethers"

/**
 * Generate a deterministic hash for data
 */
export function generateDataHash(data: any): string {
  const serialized = JSON.stringify(data, Object.keys(data).sort())
  return ethers.keccak256(ethers.toUtf8Bytes(serialized))
}

/**
 * Generate a proof hash from validation components
 */
export function generateProofHash(components: {
  dataHash: string
  isValid: boolean
  ruleSetId: string
  timestamp: number
}): string {
  const combined = `${components.dataHash}${components.isValid}${components.ruleSetId}${components.timestamp}`
  return ethers.keccak256(ethers.toUtf8Bytes(combined))
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address)
  } catch {
    return false
  }
}

/**
 * Format validation result for display
 */
export function formatValidationResult(result: any): string {
  return JSON.stringify(result, null, 2)
}

/**
 * Convert validation type enum to display string
 */
export function formatValidationType(type: string): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `ura_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validate rule set ID format
 */
export function isValidRuleSetId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id) && id.length >= 3 && id.length <= 50
}

/**
 * Create default URA configuration
 */
export function createDefaultConfig(chainId = 1): {
  validatorApiUrl: string
  contractAddress: string
  ruleSetManagerAddress: string
  chainId: number
} {
  return {
    validatorApiUrl: "https://api.ura-protocol.com",
    contractAddress: "0x0000000000000000000000000000000000000000", // Placeholder
    ruleSetManagerAddress: "0x0000000000000000000000000000000000000000", // Placeholder
    chainId,
  }
}
