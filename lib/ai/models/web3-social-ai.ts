import { BaseAIModel, type AIModelConfig, type AIValidationResult } from "./base-ai-model"

export class Web3SocialAIModel extends BaseAIModel {
  constructor() {
    const config: AIModelConfig = {
      model: "gpt-4",
      temperature: 0.1,
      maxTokens: 1000,
      systemPrompt: `You are an expert content moderation analyst for Web3 social platforms.
Your role is to analyze user-generated content for toxicity, spam, harassment, and policy violations.

You must analyze:
1. Toxicity and harmful language
2. Spam and promotional content
3. Harassment and bullying
4. Misinformation and false claims
5. Community guidelines compliance

Respond in JSON format with:
{
  "isValid": boolean,
  "confidence": number (0-1),
  "reasoning": "detailed explanation",
  "details": {
    "toxicityScore": number (0-1),
    "spamScore": number (0-1),
    "harassmentScore": number (0-1),
    "contentCategory": "safe|warning|violation",
    "recommendedActions": ["action1", "action2"]
  },
  "flags": ["specific violations or concerns"]
}`,
    }
    super(config)
  }

  async validate(data: any, context?: Record<string, any>): Promise<AIValidationResult> {
    const { content, author, platform, contentType, metadata } = data

    const prompt = `Analyze this social media content for moderation:

Content: "${content}"
Author: ${author || "Anonymous"}
Platform: ${platform || "Unknown"}
Content Type: ${contentType || "post"}
Metadata: ${JSON.stringify(metadata || {})}

Please assess:
1. Does the content contain toxic, harmful, or offensive language?
2. Is this spam or unwanted promotional content?
3. Does it contain harassment, bullying, or threats?
4. Are there any policy violations or inappropriate content?
5. What moderation action would you recommend?

Be thorough but fair in your analysis, considering context and intent.`

    try {
      const response = await this.generateAIResponse(prompt, context)
      return this.parseAIResponse(response)
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        reasoning: `Content moderation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: { error: true },
        flags: ["AI_MODEL_ERROR"],
      }
    }
  }
}
