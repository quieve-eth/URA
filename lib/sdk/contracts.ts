import { ethers } from "ethers"
import { type ValidationResult, type ValidationProof, type RuleSet, type URAConfig, ValidationType } from "./types"

// Contract ABIs (simplified for demo)
const VALIDATION_REGISTRY_ABI = [
  "function submitValidation(bytes32 dataHash, bytes32 proofHash, string ruleSetId, bool isValid, string metadata) external",
  "function getValidationProof(bytes32 proofHash) external view returns (tuple(bytes32 dataHash, bytes32 proofHash, address validator, uint256 timestamp, string ruleSetId, bool isValid, string metadata))",
  "function authorizedValidators(address) external view returns (bool)",
  "function getProofCount() external view returns (uint256)",
  "function proofHashes(uint256) external view returns (bytes32)",
]

const RULESET_MANAGER_ABI = [
  "function createRuleSetConfig(string id, string name, uint8 validationType) external",
  "function ruleSetConfigs(string) external view returns (tuple(string id, string name, uint8 validationType, bool isActive, uint256 createdAt, uint256 updatedAt))",
  "function getRuleSetsByType(uint8 validationType) external view returns (string[] memory)",
  "function allRuleSetIds(uint256) external view returns (string)",
]

export class ContractService {
  private config: URAConfig
  private provider?: ethers.Provider
  private signer?: ethers.Signer
  private validationRegistry?: ethers.Contract
  private ruleSetManager?: ethers.Contract

  constructor(config: URAConfig) {
    this.config = config
    this.initializeProvider()
  }

  private initializeProvider(): void {
    // Initialize with a default provider for read operations
    this.provider = new ethers.JsonRpcProvider(`https://rpc.ankr.com/eth`)
    this.initializeContracts()
  }

  private initializeContracts(): void {
    if (!this.provider) return

    this.validationRegistry = new ethers.Contract(
      this.config.contractAddress,
      VALIDATION_REGISTRY_ABI,
      this.signer || this.provider,
    )

    this.ruleSetManager = new ethers.Contract(
      this.config.ruleSetManagerAddress,
      RULESET_MANAGER_ABI,
      this.signer || this.provider,
    )
  }

  setSigner(signer: ethers.Signer): void {
    this.signer = signer
    this.initializeContracts()
  }

  async submitValidation(result: ValidationResult): Promise<string> {
    if (!this.validationRegistry || !this.signer) {
      throw new Error("Contract not initialized or signer not set")
    }

    try {
      const tx = await this.validationRegistry.submitValidation(
        result.dataHash,
        result.proofHash,
        result.ruleSetId,
        result.isValid,
        result.metadata || "",
      )

      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error("Failed to submit validation:", error)
      throw error
    }
  }

  async getValidationProof(proofHash: string): Promise<ValidationProof | null> {
    if (!this.validationRegistry) {
      throw new Error("Contract not initialized")
    }

    try {
      const proof = await this.validationRegistry.getValidationProof(proofHash)

      if (proof.timestamp === 0) {
        return null
      }

      return {
        proofHash: proof.proofHash,
        dataHash: proof.dataHash,
        validator: proof.validator,
        timestamp: Number(proof.timestamp),
        ruleSetId: proof.ruleSetId,
        isValid: proof.isValid,
        metadata: proof.metadata,
      }
    } catch (error) {
      console.error("Failed to get validation proof:", error)
      return null
    }
  }

  async getRuleSets(validationType?: ValidationType): Promise<RuleSet[]> {
    if (!this.ruleSetManager) {
      throw new Error("RuleSet manager not initialized")
    }

    try {
      let ruleSetIds: string[] = []

      if (validationType) {
        const typeIndex = Object.values(ValidationType).indexOf(validationType)
        ruleSetIds = await this.ruleSetManager.getRuleSetsByType(typeIndex)
      } else {
        // Get all rule sets (simplified - in production, implement pagination)
        const count = 10 // Assume max 10 for demo
        for (let i = 0; i < count; i++) {
          try {
            const id = await this.ruleSetManager.allRuleSetIds(i)
            if (id) ruleSetIds.push(id)
          } catch {
            break
          }
        }
      }

      const ruleSets: RuleSet[] = []
      for (const id of ruleSetIds) {
        try {
          const config = await this.ruleSetManager.ruleSetConfigs(id)
          if (config.id) {
            ruleSets.push({
              id: config.id,
              name: config.name,
              description: "", // Not stored in this simplified version
              validationType: Object.values(ValidationType)[config.validationType],
              isActive: config.isActive,
              creator: "", // Not stored in this simplified version
              createdAt: Number(config.createdAt),
              parameters: {}, // Would need separate calls to get parameters
            })
          }
        } catch (error) {
          console.error(`Failed to get rule set ${id}:`, error)
        }
      }

      return ruleSets
    } catch (error) {
      console.error("Failed to get rule sets:", error)
      return []
    }
  }

  async createRuleSet(id: string, name: string, description: string, validationType: ValidationType): Promise<string> {
    if (!this.ruleSetManager || !this.signer) {
      throw new Error("Contract not initialized or signer not set")
    }

    try {
      const typeIndex = Object.values(ValidationType).indexOf(validationType)
      const tx = await this.ruleSetManager.createRuleSetConfig(id, name, typeIndex)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error("Failed to create rule set:", error)
      throw error
    }
  }

  async isAuthorizedValidator(address: string): Promise<boolean> {
    if (!this.validationRegistry) {
      throw new Error("Contract not initialized")
    }

    try {
      return await this.validationRegistry.authorizedValidators(address)
    } catch (error) {
      console.error("Failed to check validator authorization:", error)
      return false
    }
  }

  async getValidationHistory(address: string, limit: number): Promise<ValidationProof[]> {
    if (!this.validationRegistry) {
      throw new Error("Contract not initialized")
    }

    try {
      const proofs: ValidationProof[] = []
      const totalProofs = await this.validationRegistry.getProofCount()
      const start = Math.max(0, Number(totalProofs) - limit)

      for (let i = start; i < Number(totalProofs); i++) {
        try {
          const proofHash = await this.validationRegistry.proofHashes(i)
          const proof = await this.getValidationProof(proofHash)
          if (proof && proof.validator.toLowerCase() === address.toLowerCase()) {
            proofs.push(proof)
          }
        } catch (error) {
          console.error(`Failed to get proof at index ${i}:`, error)
        }
      }

      return proofs.reverse() // Most recent first
    } catch (error) {
      console.error("Failed to get validation history:", error)
      return []
    }
  }

  updateConfig(config: URAConfig): void {
    this.config = config
    this.initializeContracts()
  }
}
