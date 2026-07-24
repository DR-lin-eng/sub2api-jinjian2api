import type { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import type { PromptAuditDraft } from '@/features/prompt-audit/domain/models/promptAuditDraft'
import type { PromptAuditEndpointDraft } from '@/features/prompt-audit/domain/models/promptAuditEndpointDraft'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'

export const DEFAULT_GUARD_MODEL = 'sileader/qwen3guard:0.6b'

export const SCANNER_CATALOG = [
  { id: 'violent', label: 'Violent' },
  { id: 'non_violent_illegal_acts', label: 'Non-violent Illegal Acts' },
  { id: 'sexual_content_or_sexual_acts', label: 'Sexual Content or Sexual Acts' },
  { id: 'pii', label: 'PII' },
  { id: 'suicide_and_self_harm', label: 'Suicide & Self-Harm' },
  { id: 'unethical_acts', label: 'Unethical Acts' },
  { id: 'politically_sensitive_topics', label: 'Politically Sensitive Topics' },
  { id: 'copyright_violation', label: 'Copyright Violation' },
  { id: 'jailbreak', label: 'Jailbreak' },
] as const

// Vue props/refs are proxies and cannot be passed to structuredClone in every
// browser. Prompt Audit state is JSON-only, so this produces a detached draft
// without retaining reactive proxies or browser storage references.
export function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function configToDraft(config: PromptAuditConfig): PromptAuditDraft {
  return {
    ...cloneData(config),
    groupIds: [...(config.groupIds ?? [])],
    scanners: [...(config.scanners ?? [])],
    endpoints: (config.endpoints ?? []).map((ep) => ({
      ...ep,
      token: '',
      clearToken: false,
    })),
  } as PromptAuditDraft
}

export function createDefaultEndpoint(index = 1): PromptAuditEndpointDraft {
  return {
    id: `guard-${Date.now()}-${index}`,
    name: `Guard ${index}`,
    protocol: 'openai_compatible',
    baseUrl: 'http://127.0.0.1:8000',
    model: DEFAULT_GUARD_MODEL,
    timeoutMs: 3000,
    inputLimit: 4000,
    enabled: true,
    hasToken: false,
    tokenStatus: 'missing',
    token: '',
    clearToken: false,
  } as PromptAuditEndpointDraft
}

export function buildUpdateRequest(draft: PromptAuditDraft) {
  return {
    expected_config_version: draft.configVersion,
    enabled: draft.enabled,
    blocking_enabled: draft.enabled && draft.blockingEnabled,
    store_pass_events: draft.storePassEvents,
    strategy: 'priority' as const,
    worker_count: Number(draft.workerCount),
    queue_capacity: Number(draft.queueCapacity),
    scanners: [...draft.scanners],
    all_groups: draft.allGroups,
    group_ids: draft.allGroups ? [] : [...draft.groupIds].sort((a, b) => a - b),
    endpoints: draft.endpoints.map((ep) => ({
      id: ep.id.trim(),
      name: ep.name.trim(),
      protocol: 'openai_compatible' as const,
      base_url: ep.baseUrl.trim(),
      model: ep.model.trim() || DEFAULT_GUARD_MODEL,
      token: ep.token.trim() || undefined,
      clear_token: ep.clearToken,
      timeout_ms: Number(ep.timeoutMs),
      input_limit: Number(ep.inputLimit),
      enabled: ep.enabled,
    })),
  }
}

export function draftFingerprint(draft: PromptAuditDraft | null): string {
  if (!draft) return ''
  return JSON.stringify(buildUpdateRequest(draft))
}

export function emptyEventFilters(): PromptEventFilters {
  return {
    decision: '',
    riskLevel: '',
    endpoint: '',
    groupId: '',
    userId: '',
    apiKeyId: '',
    requestId: '',
    promptHash: '',
    keyword: '',
    startAt: '',
    endAt: '',
  } as PromptEventFilters
}

function toISO(value: string): string | undefined {
  if (!value.trim()) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function hasExplicitDeleteRange(filters: PromptEventFilters): boolean {
  const start = toISO(filters.startAt)
  const end = toISO(filters.endAt)
  return Boolean(start && end && new Date(start).getTime() < new Date(end).getTime())
}

export type DeleteRangePreset = '1d' | '7d' | '30d' | '90d' | 'all' | 'custom'

export const DELETE_RANGE_PRESETS: ReadonlyArray<{ id: DeleteRangePreset; days: number | null }> = [
  { id: '1d', days: 1 },
  { id: '7d', days: 7 },
  { id: '30d', days: 30 },
  { id: '90d', days: 90 },
  { id: 'all', days: null },
  { id: 'custom', days: null },
]

const DAY_MS = 24 * 60 * 60 * 1000

// Presets delete events older than the chosen cutoff: the range always starts
// at the epoch and ends at (now - days) so the backend's explicit-range
// requirement is satisfied without asking the user for a begin date.
export function resolveDeleteRangeFilters(
  filters: PromptEventFilters,
  preset: DeleteRangePreset,
  now: number = Date.now(),
): PromptEventFilters {
  const resolved = cloneData(filters)
  if (preset === 'custom') return resolved
  const days = DELETE_RANGE_PRESETS.find((item) => item.id === preset)?.days ?? null
  resolved.startAt = new Date(0).toISOString()
  resolved.endAt = new Date(days === null ? now : now - days * DAY_MS).toISOString()
  return resolved
}
