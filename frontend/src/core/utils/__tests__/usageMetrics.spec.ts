import { describe, expect, it } from 'vitest'

import { calculateOutputTokensPerSecond } from '../usageMetrics'

describe('calculateOutputTokensPerSecond', () => {
  it('uses total request duration to match the existing operations metric', () => {
    expect(calculateOutputTokensPerSecond({
      outputTokens: 100,
      durationMs: 2000,
    })).toBe(50)
  })

  it.each([
    { outputTokens: 0, durationMs: 1000 },
    { outputTokens: 10, durationMs: 0 },
    { outputTokens: 10, durationMs: null },
    { outputTokens: Number.NaN, durationMs: 1000 },
    { outputTokens: 10, durationMs: Number.POSITIVE_INFINITY },
  ])('returns null when token or duration data is unusable', (usage) => {
    expect(calculateOutputTokensPerSecond(usage)).toBeNull()
  })

  it.each([
    { imageCount: 1, imageOutputTokens: 0 },
    { imageCount: 1, imageOutputTokens: 100 },
    { imageCount: 0, imageOutputTokens: 100 },
    { imageCount: 0, imageOutputTokens: 0, billingMode: 'video' },
  ])('does not report text token speed for generated media output', (imageUsage) => {
    expect(calculateOutputTokensPerSecond({
      outputTokens: 100,
      durationMs: 2000,
      ...imageUsage,
    })).toBeNull()
  })

  it('returns null when the calculated rate overflows', () => {
    expect(calculateOutputTokensPerSecond({
      outputTokens: Number.MAX_VALUE,
      durationMs: Number.MIN_VALUE,
    })).toBeNull()
  })
})
