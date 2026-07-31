export class GeminiCredentials {
  apiKey?: string
  accessToken?: string
  refreshToken?: string
  oauthType?: 'code_assist' | 'google_one' | 'ai_studio' | string
  tierId?: 'google_one_free' | 'google_ai_pro' | 'google_ai_ultra' | 'gcp_standard' | 'gcp_enterprise' | 'aistudio_free' | 'aistudio_paid' | 'LEGACY' | 'PRO' | 'ULTRA' | string
  projectId?: string
  tokenType?: string
  scope?: string
  expiresAt?: string
  modelMapping?: Record<string, string>
}
