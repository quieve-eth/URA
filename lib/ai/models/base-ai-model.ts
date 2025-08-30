import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface AIModelConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
}

export interface AIValidationResult {
  isValid: boolean
  confidence: number
  reasoning: string
  details: Record<string, any>
  flags: string[]
}

export abstract class BaseAIModel {
  protected config: AIModelConfig

  constructor(config: AIModelConfig) {
    this.config = config
  }

  protected async generateAIResponse(prompt: string, context?: Record<string, any>): Promise<string> {
    try {
      const { text } = await generateText({
        model: openai(this.config.model),
        system: this.config.systemPrompt,
        prompt: this.buildPrompt(prompt, context),
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
      })

      return text
    } catch (error) {
      console.error("AI generation error:", error)
      throw new Error(`AI model failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  protected buildPrompt(prompt: string, context?: Record<string, any>): string {
    let fullPrompt = prompt

    if (context) {
      const contextStr = Object.entries(context)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join("\n")
      fullPrompt = `Context:\n${contextStr}\n\nTask:\n${prompt}`
    }

    return fullPrompt
  }

  protected parseAIResponse(response: string): AIValidationResult {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response)
      return {
        isValid: parsed.isValid || false,
        confidence: parsed.confidence || 0,
        reasoning: parsed.reasoning || response,
        details: parsed.details || {},
        flags: parsed.flags || [],
      }
    } catch {
      // Fallback to text parsing
      return this.parseTextResponse(response)
    }
  }

  private parseTextResponse(response: string): AIValidationResult {
    const lines = response.split("\n").map((line) => line.trim())

    let isValid = false
    let confidence = 0.5
    const reasoning = response
    const details: Record<string, any> = {}
    const flags: string[] = []

    // Simple text parsing logic
    lines.forEach((line) => {
      if (line.toLowerCase().includes("valid: true") || line.toLowerCase().includes("approved")) {
        isValid = true
      }
      if (line.toLowerCase().includes("valid: false") || line.toLowerCase().includes("rejected")) {
        isValid = false
      }

      const confidenceMatch = line.match(/confidence[:\s]+(\d+\.?\d*)/i)
      if (confidenceMatch) {
        confidence = Number.parseFloat(confidenceMatch[1])
        if (confidence > 1) confidence = confidence / 100 // Convert percentage
      }

      if (line.toLowerCase().includes("flag") || line.toLowerCase().includes("warning")) {
        flags.push(line)
      }
    })

    return { isValid, confidence, reasoning, details, flags }
  }

  abstract validate(data: any, context?: Record<string, any>): Promise<AIValidationResult>
}
