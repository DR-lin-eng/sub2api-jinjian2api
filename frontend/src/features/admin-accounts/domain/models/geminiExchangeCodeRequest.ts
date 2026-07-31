export interface GeminiExchangeCodeRequest {
  sessionId: string
  state: string
  code: string
  proxyId?: number
  oauthType?: 'code_assist' | 'google_one' | 'ai_studio'
  tierId?: string
}
