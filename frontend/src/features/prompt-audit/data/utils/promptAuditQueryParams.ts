import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'

function toISO(value: string): string | undefined {
  if (!value.trim()) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function eventQueryParams(filters: PromptEventFilters): Record<string, string | number> {
  const result: Record<string, string | number> = {}
  const strFields: Array<[keyof PromptEventFilters, string]> = [
    ['decision', 'decision'],
    ['riskLevel', 'risk_level'],
    ['endpoint', 'endpoint'],
    ['requestId', 'request_id'],
    ['promptHash', 'prompt_hash'],
    ['keyword', 'keyword'],
  ]
  for (const [field, param] of strFields) {
    const value = (filters[field] as string).trim()
    if (value) result[param] = value
  }
  const numFields: Array<[keyof PromptEventFilters, string]> = [
    ['groupId', 'group_id'],
    ['userId', 'user_id'],
    ['apiKeyId', 'api_key_id'],
  ]
  for (const [field, param] of numFields) {
    const value = Number(filters[field])
    if (Number.isInteger(value) && value > 0) result[param] = value
  }
  const start = toISO(filters.startAt)
  const end = toISO(filters.endAt)
  if (start) result.start_at = start
  if (end) result.end_at = end
  return result
}

export function eventFilterPayload(filters: PromptEventFilters): Record<string, unknown> {
  return eventQueryParams(filters)
}
