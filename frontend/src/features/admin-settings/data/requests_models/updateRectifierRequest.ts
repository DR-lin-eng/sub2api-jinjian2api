import type { ThinkingDisplayMode } from '@/features/admin-settings/enums/thinkingDisplayMode'

export interface UpdateRectifierRequest {
  enabled: boolean
  thinking_signature_enabled: boolean
  thinking_budget_enabled: boolean
  thinking_display_mode: ThinkingDisplayMode
  apikey_signature_enabled: boolean
  apikey_signature_patterns: string[]
}
