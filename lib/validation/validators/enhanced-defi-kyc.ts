import { BaseValidator } from "./base"
import type { ValidationRequest, ValidationResult } from "../engine"
import { EnhancedValidationEngine } from "@/lib/ai/enhanced-validation-engine"

export class EnhancedDeFiKYCValidator extends BaseValidator {
  private aiEngine: EnhancedValidationEngine

  constructor() {
    super()
    this.aiEngine = new EnhancedValidationEngine()
  }

  async validate(request: ValidationRequest): Promise<ValidationResult> {
    try {
      // Use AI-powered validation
      const aiResult = await this.aiEngine.validateWithAI(request)

      // Enhance with additional checks
      const enhancedResult = await this.enhanceWithTraditionalChecks(request, aiResult)

      return enhancedResult
    } catch (error) {
      console.error("Enhanced DeFi KYC validation failed:", error)
      // Fallback to basic validation
      return await this.basicValidation(request)
    }
  }

  private async enhanceWithTraditionalChecks(
    request: ValidationRequest,
    aiResult: ValidationResult,
  ): Promise<ValidationResult> {
    const { data } = request
    const walletAddress = data.walletAddress

    // Additional traditional checks
    const addressValidation = this.validateAddressFormat(walletAddress)
    const riskFactors = await this.calculateAdditionalRiskFactors(data)

    return {
      ...aiResult,
      details: {
        ...aiResult.details,
        addressValidation,
        additionalRiskFactors: riskFactors,
        enhancedValidation: true,
      },
    }
  }

  private validateAddressFormat(address: string): { isValid: boolean; format: string } {
    if (!address) return { isValid: false, format: "missing" }

    // Ethereum address validation
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return { isValid: true, format: "ethereum" }
    }

    // Bitcoin address validation (simplified)
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
      return { isValid: true, format: "bitcoin" }
    }

    return { isValid: false, format: "unknown" }
  }

  private async calculateAdditionalRiskFactors(data: any): Promise<Record<string, any>> {
    return {
      accountAge: this.estimateAccountAge(data.walletAddress),
      transactionVolume: data.transactionHistory?.length || 0,
      diversityScore: this.calculateDiversityScore(data.transactionHistory || []),
    }
  }

  private estimateAccountAge(address: string): number {
    // Mock account age calculation based on address
    const addressNum = Number.parseInt(address.slice(-8), 16)
    return Math.floor(addressNum / 1000000) // Rough estimate in days
  }

  private calculateDiversityScore(transactions: any[]): number {
    if (transactions.length === 0) return 0

    const uniqueAddresses = new Set(transactions.map((tx) => tx.to || tx.from))
    return uniqueAddresses.size / transactions.length
  }

  private async basicValidation(request: ValidationRequest): Promise<ValidationResult> {
    // Fallback basic validation
    const { data } = request
    const walletAddress = data.walletAddress

    const addressValidation = this.validateAddressFormat(walletAddress)

    return this.createResult(addressValidation.isValid, 0.6, {
      fallbackValidation: true,
      addressValidation,
      reason: "AI validation failed, using basic checks",
    })
  }
}
