import { BaseValidator } from "./base"
import type { ValidationRequest, ValidationResult } from "../engine"

export class Web3SocialValidator extends BaseValidator {
  async validate(request: ValidationRequest): Promise<ValidationResult> {
    const { data } = request

    await this.delay(400) // Simulate NLP processing

    const content = data.content
    const author = data.author

    if (!content) {
      return this.createResult(false, 0, { error: "No content provided" })
    }

    // Mock content moderation
    const toxicityScore = await this.detectToxicity(content)
    const spamScore = await this.detectSpam(content, author)

    const toxicityThreshold = 0.8
    const spamThreshold = 0.7
    const isValid = toxicityScore < toxicityThreshold && spamScore < spamThreshold

    return this.createResult(isValid, 0.9, {
      toxicityScore,
      spamScore,
      toxicityThreshold,
      spamThreshold,
      contentLength: content.length,
      checks: {
        toxicityDetection: toxicityScore < toxicityThreshold ? "passed" : "failed",
        spamDetection: spamScore < spamThreshold ? "passed" : "failed",
      },
    })
  }

  private async detectToxicity(content: string): Promise<number> {
    // Mock toxicity detection using keyword analysis
    // In production, this would use models like Perspective API or custom NLP models
    const toxicKeywords = [
      "hate",
      "toxic",
      "abuse",
      "harassment",
      "threat",
      "violence",
      "discrimination",
      "offensive",
      "inappropriate",
    ]

    const words = content.toLowerCase().split(/\s+/)
    let toxicCount = 0

    toxicKeywords.forEach((keyword) => {
      if (content.toLowerCase().includes(keyword)) {
        toxicCount++
      }
    })

    // Also check for excessive caps (shouting)
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
    if (capsRatio > 0.5) {
      toxicCount++
    }

    return Math.min(toxicCount / 5, 1.0)
  }

  private async detectSpam(content: string, author?: string): Promise<number> {
    // Mock spam detection
    let spamScore = 0

    // Check for repetitive content
    const words = content.split(/\s+/)
    const uniqueWords = new Set(words)
    const repetitionRatio = 1 - uniqueWords.size / words.length
    spamScore += repetitionRatio * 0.5

    // Check for excessive links
    const linkCount = (content.match(/https?:\/\/\S+/g) || []).length
    if (linkCount > 3) {
      spamScore += 0.3
    }

    // Check for excessive emojis
    const emojiCount = (
      content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
    ).length
    if (emojiCount > content.length * 0.1) {
      spamScore += 0.2
    }

    return Math.min(spamScore, 1.0)
  }
}
