export class WebSearchProviderConfig {
  type!: 'brave' | 'tavily'
  apiKey!: string
  apiKeyConfigured!: boolean
  quotaLimit!: number | null
  subscribedAt!: number | null
  quotaUsed?: number
  proxyId!: number | null
  expiresAt!: number | null
}
