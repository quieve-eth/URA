import { type ValidationRequest, type ValidationResult, type URAConfig, ValidationType } from "./types"
import { generateProofHash } from "./utils"

export class ValidationService {
  private config: URAConfig

  constructor(config: URAConfig) {
    this.config = config
  }

  async validateData(request: ValidationRequest & { dataHash: string }): Promise<ValidationResult> {
    try {
      const response = await fetch(`${this.config.validatorApiUrl}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          data: request.data,
          dataHash: request.dataHash,
          ruleSetId: request.ruleSetId,
          validationType: request.validationType,
          metadata: request.metadata,
        }),
      })

      if (!response.ok) {
        throw new Error(`Validation API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Generate proof hash for the result
      const proofHash = generateProofHash({
        dataHash: request.dataHash,
        isValid: result.isValid,
        ruleSetId: request.ruleSetId,
        timestamp: result.timestamp,
      })

      return {
        ...result,
        proofHash,
        dataHash: request.dataHash,
      }
    } catch (error) {
      console.error("Validation service error:", error)
      throw error
    }
  }

  async getValidationTypes(): Promise<ValidationType[]> {
    try {
      const response = await fetch(`${this.config.validatorApiUrl}/validation-types`, {
        headers: {
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to get validation types:", error)
      return Object.values(ValidationType)
    }
  }

  async getRuleSetInfo(ruleSetId: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.validatorApiUrl}/rulesets/${ruleSetId}`, {
        headers: {
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to get rule set info:", error)
      throw error
    }
  }

  updateConfig(config: URAConfig): void {
    this.config = config
  }
}
