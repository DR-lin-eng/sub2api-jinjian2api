import type { ThinkingDisplayMode } from '@/features/admin-settings/enums/thinkingDisplayMode'

export class RectifierSettings {
  enabled!: boolean
  thinkingSignatureEnabled!: boolean
  thinkingBudgetEnabled!: boolean
  thinkingDisplayMode!: ThinkingDisplayMode
  apikeySignatureEnabled!: boolean
  apikeySignaturePatterns!: string[]
}
