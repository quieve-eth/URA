import { ValidationType } from "@/lib/sdk/types"
import { EnhancedDeFiKYCValidator } from "./validators/enhanced-defi-kyc"
import { DeSciPlagiarismValidator } from "./validators/desci-plagiarism"
import { DePINSensorValidator } from "./validators/depin-sensor"
import { EnhancedWeb3SocialValidator } from "./validators/enhanced-web3-social"

export interface ValidationRequest {
  data: any
  dataHash: string
  ruleSetId: string
  validationType: ValidationType
  metadata: Record<string, any>
}

export interface ValidationResult {
  isValid: boolean
  timestamp: number
  confidence: number
  details: Record<string, any>
  errors?: string[]
}

export class ValidationEngine {
  private validators: Map<ValidationType, any>

  constructor() {
    this.validators = new Map([
      [ValidationType.DEFI_KYC, new EnhancedDeFiKYCValidator()],
      [ValidationType.DESCI_PLAGIARISM, new DeSciPlagiarismValidator()],
      [ValidationType.DEPIN_SENSOR, new DePINSensorValidator()],
      [ValidationType.WEB3_SOCIAL, new EnhancedWeb3SocialValidator()],
    ])
  }

  async validate(request: ValidationRequest): Promise<ValidationResult> {
    const validator = this.validators.get(request.validationType)

    if (!validator) {
      throw new Error(`No validator found for type: ${request.validationType}`)
    }

    try {
      // Pre-validation checks
      await this.preValidate(request)

      // Run specific validator
      const result = await validator.validate(request)

      // Post-validation processing
      return this.postValidate(result, request)
    } catch (error) {
      console.error(`Validation error for ${request.validationType}:`, error)
      return {
        isValid: false,
        timestamp: Date.now(),
        confidence: 0,
        details: { error: error instanceof Error ? error.message : "Unknown error" },
        errors: [error instanceof Error ? error.message : "Unknown error"],
      }
    }
  }

  private async preValidate(request: ValidationRequest): Promise<void> {
    // Common pre-validation checks
    if (!request.data) {
      throw new Error("No data provided for validation")
    }

    if (!request.dataHash) {
      throw new Error("No data hash provided")
    }

    if (!request.ruleSetId) {
      throw new Error("No rule set ID provided")
    }

    // Verify data hash matches data (simplified check)
    // In production, this would be more sophisticated
    const dataString = JSON.stringify(request.data)
    if (dataString.length === 0) {
      throw new Error("Invalid data format")
    }
  }

  private async postValidate(result: ValidationResult, request: ValidationRequest): Promise<ValidationResult> {
    // Add timestamp if not present
    if (!result.timestamp) {
      result.timestamp = Date.now()
    }

    // Ensure confidence is within valid range
    if (result.confidence < 0) result.confidence = 0
    if (result.confidence > 1) result.confidence = 1

    // Add metadata to details
    result.details = {
      ...result.details,
      ruleSetId: request.ruleSetId,
      validationType: request.validationType,
      processingTime: Date.now() - (result.timestamp || Date.now()),
    }

    return result
  }

  async batchValidate(requests: ValidationRequest[]): Promise<ValidationResult[]> {
    const results = await Promise.allSettled(requests.map((request) => this.validate(request)))

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        return {
          isValid: false,
          timestamp: Date.now(),
          confidence: 0,
          details: { error: result.reason?.message || "Batch validation failed" },
          errors: [result.reason?.message || "Batch validation failed"],
        }
      }
    })
  }

  getAvailableValidators(): ValidationType[] {
    return Array.from(this.validators.keys())
  }
}
