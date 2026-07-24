import type { OpenAIRateLimit } from './openAIRateLimit'

export class OpenAIAdditionalRateLimit {
  limitName!: string
  meteredFeature!: string
  rateLimit?: OpenAIRateLimit
}
