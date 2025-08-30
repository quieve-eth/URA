import { ValidationType } from "@/lib/sdk/types"
import type { ValidationRequest, ValidationResult } from "@/lib/validation/engine"
import { AIModelFactory } from "./model-factory"
import type { AIValidationResult } from "./models/base-ai-model"

export class EnhancedValidationEngine {
  async validateWithAI(request: ValidationRequest): Promise<ValidationResult> {
    try {
      // Get the appropriate AI model
      const aiModel = AIModelFactory.getModel(request.validationType)

      // Prepare context for AI model
      const context = {
        ruleSetId: request.ruleSetId,
        validationType: request.validationType,
        metadata: request.metadata,
        timestamp: Date.now(),
      }

      // Run AI validation
      const aiResult = await aiModel.validate(request.data, context)

      // Convert AI result to validation result
      return this.convertAIResult(aiResult, request)
    } catch (error) {
      console.error(`Enhanced validation error for ${request.validationType}:`, error)
      return {
        isValid: false,
        timestamp: Date.now(),
        confidence: 0,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          fallbackUsed: true,
        },
        errors: [error instanceof Error ? error.message : "Unknown error"],
      }
    }
  }

  private convertAIResult(aiResult: AIValidationResult, request: ValidationRequest): ValidationResult {
    return {
      isValid: aiResult.isValid,
      timestamp: Date.now(),
      confidence: aiResult.confidence,
      details: {
        ...aiResult.details,
        reasoning: aiResult.reasoning,
        flags: aiResult.flags,
        aiModel: request.validationType,
        ruleSetId: request.ruleSetId,
      },
      errors: aiResult.flags.length > 0 ? aiResult.flags : undefined,
    }
  }

  async batchValidateWithAI(requests: ValidationRequest[]): Promise<ValidationResult[]> {
    const results = await Promise.allSettled(requests.map((request) => this.validateWithAI(request)))

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        return {
          isValid: false,
          timestamp: Date.now(),
          confidence: 0,
          details: {
            error: result.reason?.message || "Batch AI validation failed",
            requestIndex: index,
          },
          errors: [result.reason?.message || "Batch AI validation failed"],
        }
      }
    })
  }

  async getModelCapabilities(validationType: ValidationType): Promise<Record<string, any>> {
    try {
      const aiModel = AIModelFactory.getModel(validationType)
      return {
        validationType,
        modelType: aiModel.constructor.name,
        capabilities: this.getCapabilitiesForType(validationType),
        status: "available",
      }
    } catch (error) {
      return {
        validationType,
        status: "unavailable",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private getCapabilitiesForType(validationType: ValidationType): string[] {
    const capabilities = {
      [ValidationType.DEFI_KYC]: [
        "OFAC sanctions screening",
        "AML risk assessment",
        "Transaction pattern analysis",
        "Geographic risk evaluation",
      ],
      [ValidationType.DESCI_PLAGIARISM]: [
        "Text similarity detection",
        "Citation analysis",
        "Academic integrity assessment",
        "Originality scoring",
      ],
      [ValidationType.DEPIN_SENSOR]: [
        "Anomaly detection",
        "Data quality assessment",
        "Temporal consistency analysis",
        "Physical plausibility validation",
      ],
      [ValidationType.WEB3_SOCIAL]: [
        "Toxicity detection",
        "Spam identification",
        "Harassment detection",
        "Content policy compliance",
      ],
    }

    return capabilities[validationType] || []
  }
}
