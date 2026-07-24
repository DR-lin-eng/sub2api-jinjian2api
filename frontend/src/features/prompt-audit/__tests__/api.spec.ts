import { beforeEach, describe, expect, it, vi } from 'vitest'
import { emptyEventFilters } from '@/features/prompt-audit/presentation/utils/promptAuditViewModel'

const client = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn(), post: vi.fn(), delete: vi.fn() }))
vi.mock('@/core/networks/client', () => ({ apiClient: client }))

import { promptAuditQueryDatasource } from '@/features/prompt-audit/data/datasources/promptAuditQueryDatasource'
import { promptAuditActionDatasource } from '@/features/prompt-audit/data/datasources/promptAuditActionDatasource'

describe('Prompt Audit API', () => {
  beforeEach(() => Object.values(client).forEach((mock) => mock.mockReset()))

  it('uses the independent admin route namespace', async () => {
    client.get.mockResolvedValue({ data: { config_version: 1 } })
    await promptAuditQueryDatasource.getConfig()
    expect(client.get).toHaveBeenCalledWith('/admin/prompt-audit/config')

    client.get.mockResolvedValue({ data: { process_status: 'running' } })
    await promptAuditQueryDatasource.getRuntime()
    expect(client.get).toHaveBeenCalledWith('/admin/prompt-audit/runtime')
  })

  it('sends a temporary probe token only in the request and never invents response credentials', async () => {
    client.post.mockResolvedValue({ data: { ok: true, token_applied: true } })
    const result = await promptAuditActionDatasource.probeEndpoint({
      id: 'guard-1', name: 'Guard', protocol: 'openai_compatible', baseUrl: 'http://127.0.0.1:8000', model: 'guard',
      token: 'api-canary-secret', clearToken: false, timeoutMs: 1000, inputLimit: 1000, enabled: true, hasToken: false, tokenStatus: 'missing',
    })
    expect(client.post).toHaveBeenCalledWith('/admin/prompt-audit/endpoints/probe', expect.objectContaining({ endpoint: expect.objectContaining({ token: 'api-canary-secret' }) }))
    expect(JSON.stringify(result)).not.toContain('api-canary-secret')
  })

  it('passes a server preview token through the confirmed filter-delete contract', async () => {
    client.post.mockResolvedValue({ data: { deleted_events: 2, deleted_jobs: 2 } })
    const filters = emptyEventFilters()
    filters.startAt = '2026-07-15T00:00'
    filters.endAt = '2026-07-16T00:00'
    await promptAuditActionDatasource.deleteEventsByFilter(filters, {
      matchedCount: 2, filterSummary: {}, snapshotMaxId: 10, filterHash: 'a'.repeat(64), confirmationToken: 'opaque-token', expiresAt: '2026-07-16T00:05:00Z',
    })
    expect(client.post).toHaveBeenCalledWith('/admin/prompt-audit/events/delete-by-filter', expect.objectContaining({
      snapshot_max_id: 10, filter_hash: 'a'.repeat(64), confirmation_token: 'opaque-token', confirm: true,
    }))
  })
})
