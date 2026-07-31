import type { BillingMode } from '@/core/constants/channel'
import type { PricingInterval } from '@/features/admin-channels/domain/models/pricingInterval'

type TranslateFn = (key: string, params?: Record<string, unknown>) => string

export interface IntervalFormEntry {
  min_tokens: number
  max_tokens: number | null
  tier_label: string
  input_price: number | string | null
  output_price: number | string | null
  cache_write_price: number | string | null
  cache_read_price: number | string | null
  per_request_price: number | string | null
  sort_order: number
}

export interface PricingFormEntry {
  models: string[]
  billing_mode: BillingMode
  input_price: number | string | null
  output_price: number | string | null
  cache_write_price: number | string | null
  cache_read_price: number | string | null
  image_input_price: number | string | null
  image_output_price: number | string | null
  per_request_price: number | string | null
  intervals: IntervalFormEntry[]
}

const MTOK = 1_000_000

export function toNullableNumber(val: number | string | null | undefined): number | null {
  if (val === null || val === undefined || val === '') return null
  const num = Number(val)
  return isNaN(num) ? null : num
}

/** UI value ($/MTok) → backend value (per-token). */
export function mTokToPerToken(val: number | string | null | undefined): number | null {
  const num = toNullableNumber(val)
  return num === null ? null : parseFloat((num / MTOK).toPrecision(10))
}

/** Backend value (per-token) → UI value ($/MTok). toPrecision(10) removes float error. */
export function perTokenToMTok(val: number | null | undefined): number | null {
  if (val === null || val === undefined) return null
  return parseFloat((val * MTOK).toPrecision(10))
}

export function apiIntervalsToForm(intervals: PricingInterval[]): IntervalFormEntry[] {
  return (intervals || []).map(iv => ({
    min_tokens: iv.minTokens,
    max_tokens: iv.maxTokens,
    tier_label: iv.tierLabel || '',
    input_price: perTokenToMTok(iv.inputPrice),
    output_price: perTokenToMTok(iv.outputPrice),
    cache_write_price: perTokenToMTok(iv.cacheWritePrice),
    cache_read_price: perTokenToMTok(iv.cacheReadPrice),
    per_request_price: iv.perRequestPrice,
    sort_order: iv.sortOrder,
  }))
}

export function formIntervalsToAPI(intervals: IntervalFormEntry[]): PricingInterval[] {
  return (intervals || []).map(iv => ({
    minTokens: iv.min_tokens,
    maxTokens: iv.max_tokens,
    tierLabel: iv.tier_label,
    inputPrice: mTokToPerToken(iv.input_price),
    outputPrice: mTokToPerToken(iv.output_price),
    cacheWritePrice: mTokToPerToken(iv.cache_write_price),
    cacheReadPrice: mTokToPerToken(iv.cache_read_price),
    perRequestPrice: toNullableNumber(iv.per_request_price),
    sortOrder: iv.sort_order,
  }))
}

// ── Model pattern conflict detection ──────────────────────

interface ModelPattern {
  pattern: string
  prefix: string
  wildcard: boolean
}

function toModelPattern(model: string): ModelPattern {
  const lower = model.toLowerCase()
  const wildcard = lower.endsWith('*')
  return {
    pattern: model,
    prefix: wildcard ? lower.slice(0, -1) : lower,
    wildcard,
  }
}

function patternsConflict(a: ModelPattern, b: ModelPattern): boolean {
  if (!a.wildcard && !b.wildcard) return a.prefix === b.prefix
  if (a.wildcard && !b.wildcard) return b.prefix.startsWith(a.prefix)
  if (!a.wildcard && b.wildcard) return a.prefix.startsWith(b.prefix)
  return a.prefix.startsWith(b.prefix) || b.prefix.startsWith(a.prefix)
}

/** Detect a conflict in a list of model patterns; return the conflicting pair or null. */
export function findModelConflict(models: string[]): [string, string] | null {
  const patterns = models.map(toModelPattern)
  for (let i = 0; i < patterns.length; i++) {
    for (let j = i + 1; j < patterns.length; j++) {
      if (patternsConflict(patterns[i], patterns[j])) {
        return [patterns[i].pattern, patterns[j].pattern]
      }
    }
  }
  return null
}

// ── Interval validation ────────────────────────────────────

/**
 * Validate interval list; return an i18n error string or null.
 * token mode: intervals are (min, max] context-token bands; must not overlap; unbounded must be last.
 * per_request / image mode: intervals match on tier_label; skip overlap / last-unlimited checks.
 */
export function validateIntervals(
  intervals: IntervalFormEntry[],
  mode: BillingMode,
  t: TranslateFn,
): string | null {
  if (!intervals || intervals.length === 0) return null

  const sorted = [...intervals].sort((a, b) => a.min_tokens - b.min_tokens)

  for (let i = 0; i < sorted.length; i++) {
    const err = validateSingleInterval(sorted[i], i, t)
    if (err) return err
  }

  if (mode !== 'token') return null
  return checkIntervalOverlap(sorted, t)
}

function intervalValidationMessage(
  t: TranslateFn,
  key: string,
  params: Record<string, unknown>,
): string {
  return t(`admin.channels.intervalValidation.${key}`, params)
}

function intervalPriceLabel(t: TranslateFn, key: string): string {
  return t(`admin.channels.intervalValidation.price.${key}`)
}

function validateSingleInterval(iv: IntervalFormEntry, idx: number, t: TranslateFn): string | null {
  const index = idx + 1
  if (iv.min_tokens < 0) {
    return intervalValidationMessage(t, 'negativeMin', { index, value: iv.min_tokens })
  }
  if (iv.max_tokens != null) {
    if (iv.max_tokens <= 0) {
      return intervalValidationMessage(t, 'maxPositive', { index, value: iv.max_tokens })
    }
    if (iv.max_tokens <= iv.min_tokens) {
      return intervalValidationMessage(t, 'maxGreaterThanMin', { index, max: iv.max_tokens, min: iv.min_tokens })
    }
  }
  return validateIntervalPrices(iv, idx, t)
}

function validateIntervalPrices(iv: IntervalFormEntry, idx: number, t: TranslateFn): string | null {
  const index = idx + 1
  const prices: [string, number | string | null][] = [
    ['inputPrice', iv.input_price],
    ['outputPrice', iv.output_price],
    ['cacheWritePrice', iv.cache_write_price],
    ['cacheReadPrice', iv.cache_read_price],
    ['perRequestPrice', iv.per_request_price],
  ]
  for (const [key, val] of prices) {
    if (val != null && val !== '' && Number(val) < 0) {
      const field = intervalPriceLabel(t, key)
      return intervalValidationMessage(t, 'negativePrice', { index, field })
    }
  }
  return null
}

function checkIntervalOverlap(sorted: IntervalFormEntry[], t: TranslateFn): string | null {
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].max_tokens == null && i < sorted.length - 1) {
      return intervalValidationMessage(t, 'unboundedLast', { index: i + 1 })
    }
    if (i === 0) continue
    const prev = sorted[i - 1]
    if (prev.max_tokens == null || prev.max_tokens > sorted[i].min_tokens) {
      const prevMax = prev.max_tokens == null ? '∞' : String(prev.max_tokens)
      return intervalValidationMessage(t, 'overlap', {
        previousIndex: i,
        currentIndex: i + 1,
        previousMax: prevMax,
        currentMin: sorted[i].min_tokens,
      })
    }
  }
  return null
}

/** Platform tag color classes (bg + text) — used on model chips. */
export function getPlatformTagClass(platform: string): string {
  switch (platform) {
    case 'anthropic': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'openai': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'gemini': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'antigravity': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'grok': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

/** Platform text-only color (matches getPlatformTagClass palette) — for input/text scenarios. */
export function getPlatformTextClass(platform: string): string {
  switch (platform) {
    case 'anthropic': return 'text-orange-700 dark:text-orange-400'
    case 'openai': return 'text-emerald-700 dark:text-emerald-400'
    case 'gemini': return 'text-blue-700 dark:text-blue-400'
    case 'antigravity': return 'text-purple-700 dark:text-purple-400'
    case 'grok': return 'text-slate-700 dark:text-slate-300'
    default: return ''
  }
}
