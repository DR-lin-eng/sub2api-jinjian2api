export interface GeminiAuthUrlRequest {
  proxyId?: number
  projectId?: string
  oauthType?: 'code_assist' | 'google_one' | 'ai_studio'
  tierId?: string
}
