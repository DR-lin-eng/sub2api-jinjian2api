import type {
  ContentModerationModelFilter,
  ContentModerationModelFilterType,
  KeywordBlockingMode,
} from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'

export const riskThresholdDefaults: Record<string, number> = {
  harassment: 98,
  'harassment/threatening': 90,
  hate: 65,
  'hate/threatening': 65,
  illicit: 95,
  'illicit/violent': 95,
  'self-harm': 65,
  'self-harm/intent': 85,
  'self-harm/instructions': 65,
  sexual: 65,
  'sexual/minors': 65,
  violence: 95,
  'violence/graphic': 95,
}

export const riskThresholdCategories = Object.keys(riskThresholdDefaults)

export function parseApiKeys(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item, index, items) => item !== '' && items.indexOf(item) === index)
}

export function normalizeKeywordBlockingMode(value: unknown): KeywordBlockingMode {
  if (value === 'keyword_only' || value === 'api_only' || value === 'keyword_and_api') {
    return value
  }
  return 'keyword_and_api'
}

export function normalizeModelFilter(value: unknown): ContentModerationModelFilter {
  if (!value || typeof value !== 'object') {
    return { type: 'all', models: [] }
  }
  const raw = value as Partial<ContentModerationModelFilter>
  const type = normalizeModelFilterType(raw.type)
  return {
    type,
    models: type === 'all' ? [] : normalizeModelNames(raw.models),
  }
}

export function normalizeModelFilterType(value: unknown): ContentModerationModelFilterType {
  if (value === 'include' || value === 'exclude' || value === 'all') {
    return value
  }
  return 'all'
}

export function normalizeModelNames(models: unknown): string[] {
  if (!Array.isArray(models)) return []
  const seen = new Set<string>()
  const normalized: string[] = []
  for (const item of models) {
    const model = String(item ?? '').trim()
    if (!model) continue
    const key = model.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    normalized.push(model)
  }
  return normalized
}

export function buildModelFilterPayload(
  typeValue: unknown,
  models: unknown,
): ContentModerationModelFilter {
  const type = normalizeModelFilterType(typeValue)
  return {
    type,
    models: type === 'all' ? [] : normalizeModelNames(models),
  }
}

export function riskThresholdsFromConfig(
  thresholds: Record<string, number> | null | undefined,
): Record<string, number> {
  const normalized: Record<string, number> = { ...riskThresholdDefaults }
  for (const category of riskThresholdCategories) {
    const value = thresholds?.[category]
    if (Number.isFinite(value)) {
      normalized[category] = clampPercent(Number(value) * 100)
    }
  }
  return normalized
}

export function buildRiskThresholdPayload(
  thresholds: Record<string, number>,
): Record<string, number> {
  const payload: Record<string, number> = {}
  for (const category of riskThresholdCategories) {
    payload[category] = Number((clampPercent(thresholds[category]) / 100).toFixed(4))
  }
  return payload
}

export function clampPercent(value: unknown): number {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return Math.min(100, Math.max(0, numeric))
}

export function formatThresholdPercent(value: number): string {
  return `${clampPercent(value).toFixed(1)}%`
}

export function parseBlockedKeywords(value: string): string[] {
  const seen = new Set<string>()
  const keywords: string[] = []
  for (const line of value.split(/\r?\n/)) {
    const keyword = line.trim()
    if (!keyword) continue
    const key = keyword.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    keywords.push(keyword)
  }
  return keywords
}

export function normalizeDateTimeLocal(value: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}
