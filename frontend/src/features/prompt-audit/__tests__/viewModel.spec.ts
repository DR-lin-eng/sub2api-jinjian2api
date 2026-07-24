import { describe, expect, it } from 'vitest'
import type { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import {
  buildUpdateRequest,
  configToDraft,
  draftFingerprint,
  emptyEventFilters,
  eventFilterPayload,
  hasExplicitDeleteRange,
  SCANNER_CATALOG,
} from '@/features/prompt-audit/presentation/utils/promptAuditViewModel'

const config = (): PromptAuditConfig => ({
  enabled: true,
  blockingEnabled: false,
  storePassEvents: false,
  effectiveMode: 'async_audit',
  strategy: 'priority',
  workerCount: 4,
  queueCapacity: 100,
  scanners: SCANNER_CATALOG.map((item) => item.id),
  allGroups: true,
  groupIds: [],
  endpoints: [{
    id: 'guard-1', name: 'Guard One', protocol: 'openai_compatible', baseUrl: 'http://127.0.0.1:8000',
    model: 'sileader/qwen3guard:0.6b', timeoutMs: 3000, inputLimit: 4000, enabled: true,
    hasToken: true, tokenStatus: 'configured',
  }],
  configVersion: 7,
  updatedAt: '2026-07-16T00:00:00Z',
  updatedBy: 1,
  changeSummary: '{}',
} as PromptAuditConfig)

describe('Prompt Audit view model', () => {
  it('normalizes legacy null collections from the public config', () => {
    const legacy = { ...config(), groupIds: null, scanners: null, endpoints: null } as unknown as PromptAuditConfig
    expect(configToDraft(legacy)).toMatchObject({ groupIds: [], scanners: [], endpoints: [] })
  })

  it('models all nine official input scanners', () => {
    expect(SCANNER_CATALOG).toHaveLength(9)
    expect(SCANNER_CATALOG.map((item) => item.id)).toContain('suicide_and_self_harm')
  })

  it('keeps, replaces, or explicitly clears a saved token without copying plaintext from the server', () => {
    const draft = configToDraft(config())
    expect(draft.endpoints[0].token).toBe('')
    expect(buildUpdateRequest(draft).endpoints[0]).toMatchObject({ token: undefined, clear_token: false })

    draft.endpoints[0].token = 'temporary-canary-token'
    expect(buildUpdateRequest(draft).endpoints[0]).toMatchObject({ token: 'temporary-canary-token', clear_token: false })

    draft.endpoints[0].token = ''
    draft.endpoints[0].clearToken = true
    expect(buildUpdateRequest(draft).endpoints[0]).toMatchObject({ token: undefined, clear_token: true })
  })

  it('tracks dirty state from the full normalized save payload', () => {
    const original = configToDraft(config())
    const changed = configToDraft(config())
    expect(draftFingerprint(changed)).toBe(draftFingerprint(original))
    changed.queueCapacity += 1
    expect(draftFingerprint(changed)).not.toBe(draftFingerprint(original))
  })

  it('requires a valid explicit range and sends canonical ISO timestamps for filter deletion', () => {
    const filters = emptyEventFilters()
    expect(hasExplicitDeleteRange(filters)).toBe(false)
    filters.startAt = '2026-07-15T10:00'
    filters.endAt = '2026-07-16T10:00'
    filters.groupId = '9'
    expect(hasExplicitDeleteRange(filters)).toBe(true)
    expect(eventFilterPayload(filters)).toMatchObject({
      group_id: 9,
      start_at: new Date(filters.startAt).toISOString(),
      end_at: new Date(filters.endAt).toISOString(),
    })
  })
})
