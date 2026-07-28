import { describe, expect, it } from 'vitest'
import {
  buildModelFilterPayload,
  buildRiskThresholdPayload,
  normalizeKeywordBlockingMode,
  normalizeModelFilter,
  parseApiKeys,
  parseBlockedKeywords,
  riskThresholdsFromConfig,
} from '@/features/admin-risk-control/presentation/composables/riskControlFormResolvers'

describe('risk control form resolvers', () => {
  it('preserves the legacy API key and keyword de-duplication semantics', () => {
    expect(parseApiKeys(' key-a\nkey-a\n key-b ')).toEqual(['key-a', 'key-b'])
    expect(parseBlockedKeywords(' Foo\nfoo\nBar ')).toEqual(['Foo', 'Bar'])
  })

  it('normalizes model filters without widening invalid configurations', () => {
    expect(normalizeModelFilter(null)).toEqual({ type: 'all', models: [] })
    expect(normalizeModelFilter({ type: 'include', models: [' GPT-4o ', 'gpt-4o', 'o3'] })).toEqual({
      type: 'include',
      models: ['GPT-4o', 'o3'],
    })
    expect(buildModelFilterPayload('all', ['ignored'])).toEqual({ type: 'all', models: [] })
    expect(normalizeKeywordBlockingMode('invalid')).toBe('keyword_and_api')
  })

  it('keeps threshold conversion stable across load and save', () => {
    const form = riskThresholdsFromConfig({ harassment: 0.42, violence: 2 })
    expect(form.harassment).toBe(42)
    expect(form.violence).toBe(100)
    expect(buildRiskThresholdPayload(form).harassment).toBe(0.42)
    expect(buildRiskThresholdPayload(form).violence).toBe(1)
  })
})
