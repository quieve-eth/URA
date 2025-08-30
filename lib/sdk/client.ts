import { ethers } from "ethers"
import type {
  ValidationRequest,
  ValidationResult,
  ValidationProof,
  RuleSet,
  URAConfig,
  SDKOptions,
  ValidationType,
} from "./types"
import { ValidationService } from "./validation"
import { ContractService } from "./contracts"
import { generateDataHash } from "./utils"

export class URAClient {
  private config: URAConfig
  private validationService: ValidationService
  private contractService: ContractService
  private provider?: ethers.Provider
  private signer?: ethers.Signer

  constructor(options: SDKOptions) {
    this.config = options.config
    this.validationService = new ValidationService(this.config)
    this.contractService = new ContractService(this.config)

    if (options.walletProvider) {
      this.provider = new ethers.BrowserProvider(options.walletProvider)
    }

    if (options.autoConnect) {
      this.connectWallet()
    }
  }

  /**
   * Connect to user's wallet
   */
  async connectWallet(): Promise<string | null> {
    try {
      if (!this.provider) {
        throw new Error("No wallet provider configured")
      }

      const signer = await this.provider.getSigner()
      this.signer = signer
      this.contractService.setSigner(signer)

      return await signer.getAddress()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      return null
    }
  }

  /**
   * Validate data using specified rule set
   */
  async validate(request: ValidationRequest): Promise<ValidationResult> {
    try {
      // Generate data hash
      const dataHash = generateDataHash(request.data)

      // Call validation service
      const result = await this.validationService.validateData({
        ...request,
        dataHash,
      })

      return result
    } catch (error) {
      console.error("Validation failed:", error)
      throw new Error(`Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Submit validation result to blockchain
   */
  async submitValidated(validationResult: ValidationResult): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected")
      }

      const txHash = await this.contractService.submitValidation(validationResult)
      return txHash
    } catch (error) {
      console.error("Failed to submit validation:", error)
      throw new Error(`Failed to submit validation: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Get validation proof by hash
   */
  async getProof(proofHash: string): Promise<ValidationProof | null> {
    try {
      return await this.contractService.getValidationProof(proofHash)
    } catch (error) {
      console.error("Failed to get proof:", error)
      return null
    }
  }

  /**
   * Get available rule sets by validation type
   */
  async getRuleSets(validationType?: ValidationType): Promise<RuleSet[]> {
    try {
      return await this.contractService.getRuleSets(validationType)
    } catch (error) {
      console.error("Failed to get rule sets:", error)
      return []
    }
  }

  /**
   * Create a new rule set (requires authorization)
   */
  async createRuleSet(id: string, name: string, description: string, validationType: ValidationType): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected")
      }

      return await this.contractService.createRuleSet(id, name, description, validationType)
    } catch (error) {
      console.error("Failed to create rule set:", error)
      throw new Error(`Failed to create rule set: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Batch validate multiple data items
   */
  async batchValidate(requests: ValidationRequest[]): Promise<ValidationResult[]> {
    try {
      const results = await Promise.all(requests.map((request) => this.validate(request)))
      return results
    } catch (error) {
      console.error("Batch validation failed:", error)
      throw new Error(`Batch validation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Get validation history for current user
   */
  async getValidationHistory(limit = 50): Promise<ValidationProof[]> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected")
      }

      const address = await this.signer.getAddress()
      return await this.contractService.getValidationHistory(address, limit)
    } catch (error) {
      console.error("Failed to get validation history:", error)
      return []
    }
  }

  /**
   * Check if current user is authorized validator
   */
  async isAuthorizedValidator(): Promise<boolean> {
    try {
      if (!this.signer) {
        return false
      }

      const address = await this.signer.getAddress()
      return await this.contractService.isAuthorizedValidator(address)
    } catch (error) {
      console.error("Failed to check validator status:", error)
      return false
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): URAConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<URAConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.validationService.updateConfig(this.config)
    this.contractService.updateConfig(this.config)
  }
}
