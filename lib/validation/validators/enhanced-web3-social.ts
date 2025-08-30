import { BaseValidator } from "./base"
import type { ValidationRequest, ValidationResult } from "../engine"
import { Web3SocialAIModel } from "@/lib/ai/models/web3-social-ai"

export class EnhancedWeb3SocialValidator extends BaseValidator {
  private aiModel: Web3SocialAIModel

  constructor() {
    super()
    this.aiModel = new Web3SocialAIModel()
  }

  async validate(request: ValidationRequest): Promise<ValidationResult> {
    const { data } = request

    if (!data.content) {
      return this.createResult(false, 0, { error: "No content provided" })
    }

    try {
      console.log("[v0] Starting AI analysis for Web3 Social content...")

      const aiResult = await this.aiModel.validate(data, {
        ruleSetId: request.ruleSetId,
        validationType: request.validationType,
        metadata: request.metadata,
      })

      console.log("[v0] AI analysis complete:", {
        isValid: aiResult.isValid,
        confidence: aiResult.confidence,
        flags: aiResult.flags,
        details: aiResult.details,
      })

      // Convert AI result to validation result format
      return this.createResult(aiResult.isValid, aiResult.confidence, {
        reasoning: aiResult.reasoning,
        flags: aiResult.flags,
        aiAnalysis: aiResult.details,
        contentLength: data.content.length,
        toxicityScore: aiResult.details.toxicityScore || 0,
        spamScore: aiResult.details.spamScore || 0,
        harassmentScore: aiResult.details.harassmentScore || 0,
        contentCategory: aiResult.details.contentCategory || "unknown",
        recommendedActions: aiResult.details.recommendedActions || [],
        checks: {
          toxicityDetection: aiResult.details.toxicityScore < 0.7 ? "passed" : "failed",
          spamDetection: aiResult.details.spamScore < 0.7 ? "passed" : "failed",
          harassmentDetection: aiResult.details.harassmentScore < 0.7 ? "passed" : "failed",
          aiAnalysis: "completed",
        },
      })
    } catch (error) {
      console.error("[v0] AI validation error:", error)

      // Fallback to basic validation if AI fails
      return this.createResult(false, 0.1, {
        error: `AI validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        fallbackUsed: true,
        contentLength: data.content.length,
      })
    }
  }
}
