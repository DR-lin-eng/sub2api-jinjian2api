import type { OpenAICompactMode } from '@/features/admin-accounts/enums/openAICompactMode'

export type OpenAICompactState = {
  openaiCompactMode?: OpenAICompactMode
  openaiCompactSupported?: boolean
  openaiCompactCheckedAt?: string
  openaiCompactLastStatus?: number
  openaiCompactLastError?: string
}
