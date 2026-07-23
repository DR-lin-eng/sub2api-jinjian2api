import type { GeminiOAuthCapabilities } from '@/features/admin-accounts/domain/models/geminiOAuthCapabilities'

export interface GeminiQueryRepository {
  getCapabilities(): Promise<GeminiOAuthCapabilities>
}
