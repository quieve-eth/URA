export enum ValidationType {
  DEFI_KYC = "DEFI_KYC",
  DESCI_PLAGIARISM = "DESCI_PLAGIARISM",
  DEPIN_SENSOR = "DEPIN_SENSOR",
  WEB3_SOCIAL = "WEB3_SOCIAL",
}

export interface ValidationRequest {
  data: any
  ruleSetId: string
  validationType: ValidationType
  metadata?: Record<string, any>
}

export interface ValidationResult {
  isValid: boolean
  proofHash: string
  dataHash: string
  timestamp: number
  validator: string
  ruleSetId: string
  metadata?: string
  confidence?: number
  details?: Record<string, any>
}

export interface ValidationProof {
  proofHash: string
  dataHash: string
  validator: string
  timestamp: number
  ruleSetId: string
  isValid: boolean
  metadata: string
  transactionHash?: string
}

export interface RuleSet {
  id: string
  name: string
  description: string
  validationType: ValidationType
  isActive: boolean
  creator: string
  createdAt: number
  parameters: Record<string, string>
}

export interface URAConfig {
  validatorApiUrl: string
  contractAddress: string
  ruleSetManagerAddress: string
  chainId: number
  apiKey?: string
}

export interface SDKOptions {
  config: URAConfig
  walletProvider?: any
  autoConnect?: boolean
}
