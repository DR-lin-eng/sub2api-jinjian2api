import type { OpenAIRateLimit } from './openAIRateLimit'
import type { OpenAIAdditionalRateLimit } from './openAIAdditionalRateLimit'
import type { OpenAIRateLimitResetCredits } from './openAIRateLimitResetCredits'

export class OpenAIQuotaUsage {
  userId!: string
  accountId!: string
  email!: string
  planType!: string
  rateLimit?: OpenAIRateLimit
  additionalRateLimits!: OpenAIAdditionalRateLimit[]
  rateLimitResetCredits?: OpenAIRateLimitResetCredits
  fetchedAt!: number
}
