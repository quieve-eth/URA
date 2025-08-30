import type { ValidationRequest, ValidationResult } from "../engine"

export abstract class BaseValidator {
  abstract validate(request: ValidationRequest): Promise<ValidationResult>

  protected createResult(isValid: boolean, confidence: number, details: Record<string, any> = {}): ValidationResult {
    return {
      isValid,
      timestamp: Date.now(),
      confidence: Math.max(0, Math.min(1, confidence)),
      details,
    }
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
