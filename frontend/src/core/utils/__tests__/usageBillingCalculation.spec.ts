import { describe, expect, it } from 'vitest'
import { UsageLog } from '@/core/models/domain/usageLog'
import { buildUsageBillingCalculation } from '../usageBillingCalculation'

const usage = (overrides: Partial<UsageLog>): UsageLog => ({
  id: 1,
  user_id: 1,
  api_key_id: 1,
  account_id: 1,
  request_id: 'req-1',
  model: 'gpt-5.4',
  group_id: 1,
  subscription_id: null,
  inputTokens: 0,
  outputTokens: 0,
  cacheCreationTokens: 0,
  cacheReadTokens: 0,
  cacheCreation5mTokens: 0,
  cacheCreation1hTokens: 0,
  inputCost: 0,
  outputCost: 0,
  cacheCreationCost: 0,
  cacheReadCost: 0,
  totalCost: 0,
  actualCost: 0,
  rateMultiplier: 1,
  longContextBillingApplied: false,
  billingType: 0,
  stream: true,
  duration_ms: 1000,
  first_token_ms: 100,
  imageCount: 0,
  imageSize: null,
  image_input_size: null,
  image_output_size: null,
  imageSizeSource: null,
  imageSizeBreakdown: null,
  imageInputTokens: 0,
  image_inputCost: 0,
  imageOutputTokens: 0,
  image_outputCost: 0,
  videoCount: 0,
  videoResolution: null,
  videoDurationSeconds: null,
  user_agent: null,
  cache_ttl_overridden: false,
  billingMode: 'token',
  createdAt: '2026-07-20T00:00:00Z',
  ...overrides,
})

describe('buildUsageBillingCalculation', () => {
  it('reconciles token component costs and a direct group multiplier', () => {
    const result = buildUsageBillingCalculation(usage({
      inputTokens: 1_000,
      outputTokens: 200,
      inputCost: 0.005,
      outputCost: 0.006,
      totalCost: 0.011,
      actualCost: 0.0088,
      rateMultiplier: 0.8,
    }))

    expect(result.formulaKind).toBe('direct')
    expect(result.componentSubtotal).toBeCloseTo(0.011)
    expect(result.calculatedActual).toBeCloseTo(0.0088)
    expect(result.reconciled).toBe(true)
  })

  it('separates an independent image multiplier and marks the text rate as reconstructed', () => {
    const result = buildUsageBillingCalculation(usage({
      inputTokens: 1_100,
      imageInputTokens: 100,
      inputCost: 0.1,
      imageInputCost: 0.2,
      totalCost: 0.3,
      actualCost: 0.45,
      rateMultiplier: 2,
    }))

    expect(result.formulaKind).toBe('split')
    expect(result.textRateMultiplier).toBeCloseTo(0.5)
    expect(result.imageRateMultiplier).toBe(2)
    expect(result.calculatedActual).toBeCloseTo(0.45)
    expect(result.reconciled).toBe(true)
  })

  it('calculates video pricing by generated video-seconds', () => {
    const result = buildUsageBillingCalculation(usage({
      billingMode: 'video',
      videoCount: 2,
      videoDurationSeconds: 10,
      videoResolution: '720p',
      totalCost: 1.4,
      actualCost: 2.1,
      rateMultiplier: 1.5,
    }))

    expect(result.lines[0]).toMatchObject({ quantity: 20, quantityUnit: 'video_seconds' })
    expect(result.lines[0].unitPrice).toBeCloseTo(0.07)
    expect(result.calculatedActual).toBeCloseTo(2.1)
    expect(result.reconciled).toBe(true)
  })

  it('calculates image pricing by generated image count', () => {
    const result = buildUsageBillingCalculation(usage({
      billingMode: 'image',
      imageCount: 2,
      imageSize: '2K',
      totalCost: 0.4,
      actualCost: 0.6,
      rateMultiplier: 1.5,
    }))

    expect(result.lines[0]).toMatchObject({ quantity: 2, quantityUnit: 'images' })
    expect(result.lines[0].unitPrice).toBeCloseTo(0.2)
    expect(result.calculatedActual).toBeCloseTo(0.6)
    expect(result.reconciled).toBe(true)
  })

  it('uses the recorded blended rate when an old row cannot be reconstructed from one snapshot rate', () => {
    const result = buildUsageBillingCalculation(usage({
      billingMode: 'per_request',
      totalCost: 1,
      actualCost: 0.75,
      rateMultiplier: 1,
    }))

    expect(result.formulaKind).toBe('effective')
    expect(result.effectiveRateMultiplier).toBeCloseTo(0.75)
    expect(result.reconciled).toBe(true)
  })
})
