import type { OpenAIRateLimitWindow } from './openAIRateLimitWindow'

export class OpenAIRateLimit {
  allowed!: boolean
  limitReached!: boolean
  primaryWindow?: OpenAIRateLimitWindow
  secondaryWindow?: OpenAIRateLimitWindow
}
