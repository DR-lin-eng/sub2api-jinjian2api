import { GrokSSOToOAuthItemResult } from '@/features/admin-accounts/domain/models/grokSSOToOAuthItemResult'

export class GrokSSOToOAuthResponse {
  created!: GrokSSOToOAuthItemResult[]
  failed!: GrokSSOToOAuthItemResult[]
}
