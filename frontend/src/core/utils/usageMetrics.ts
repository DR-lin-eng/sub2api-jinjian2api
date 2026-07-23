import { BILLING_MODE_VIDEO } from './billingMode'

export interface OutputTokenSpeedUsage {
  outputTokens?: number | null
  durationMs?: number | null
  imageCount?: number | null
  imageOutputTokens?: number | null
  billingMode?: string | null
}

export function calculateOutputTokensPerSecond(usage: OutputTokenSpeedUsage): number | null {
  if (
    usage.billingMode === BILLING_MODE_VIDEO
    || (usage.imageCount ?? 0) > 0
    || (usage.imageOutputTokens ?? 0) > 0
  ) {
    return null
  }

  const outputTokens = usage.outputTokens
  const durationMs = usage.durationMs
  if (
    typeof outputTokens !== 'number'
    || !Number.isFinite(outputTokens)
    || outputTokens <= 0
    || typeof durationMs !== 'number'
    || !Number.isFinite(durationMs)
    || durationMs <= 0
  ) {
    return null
  }

  const tokensPerSecond = outputTokens * 1000 / durationMs
  return Number.isFinite(tokensPerSecond) ? tokensPerSecond : null
}
