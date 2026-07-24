import type { OpenAICompactMode } from './openAICompactMode'

export type OpenAICompactState = {
  openaiCompactMode?: OpenAICompactMode
  openaiCompactSupported?: boolean
  openaiCompactCheckedAt?: string
  openaiCompactLastStatus?: number
  openaiCompactLastError?: string
}
