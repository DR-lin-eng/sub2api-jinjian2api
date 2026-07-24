import type { ThinkingDisplayMode } from './streamTimeoutSettings'

export class RectifierSettings {
  enabled!: boolean
  thinkingSignatureEnabled!: boolean
  thinkingBudgetEnabled!: boolean
  thinkingDisplayMode!: ThinkingDisplayMode
  apikeySignatureEnabled!: boolean
  apikeySignaturePatterns!: string[]
}
