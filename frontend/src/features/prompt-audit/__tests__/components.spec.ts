import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import EndpointPool from '@/features/prompt-audit/presentation/widgets/EndpointPool.vue'
import PolicyPanel from '@/features/prompt-audit/presentation/widgets/PolicyPanel.vue'
import EventWorkspace from '@/features/prompt-audit/presentation/widgets/EventWorkspace.vue'
import EventDetailDialog from '@/features/prompt-audit/presentation/widgets/EventDetailDialog.vue'
import FilterDeleteDialog from '@/features/prompt-audit/presentation/widgets/FilterDeleteDialog.vue'
import type { PromptAuditDraft } from '@/features/prompt-audit/domain/models/promptAuditDraft'
import type { PromptAuditEndpointDraft } from '@/features/prompt-audit/domain/models/promptAuditEndpointDraft'
import type { PromptAuditEvent } from '@/features/prompt-audit/domain/models/promptAuditEvent'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'
import { emptyEventFilters, resolveDeleteRangeFilters, SCANNER_CATALOG } from '@/features/prompt-audit/presentation/utils/promptAuditViewModel'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return { ...actual, useI18n: () => ({ locale: { value: 'en' }, t: (key: string, params?: Record<string, unknown>) => key.replace(/\{(\w+)\}/g, (_, token) => String(params?.[token] ?? `{${token}}`)) }) }
})

const DialogStub = defineComponent({ props: ['show', 'title'], emits: ['close'], template: '<div v-if="show" data-test="dialog"><slot /><slot name="footer" /></div>' })
const PaginationStub = defineComponent({ props: ['total', 'page', 'pageSize'], emits: ['update:page', 'update:pageSize'], template: '<div data-test="pagination" />' })

const endpoint = (): PromptAuditEndpointDraft => ({
  id: 'guard-1', name: 'Guard One', protocol: 'openai_compatible', baseUrl: 'http://127.0.0.1:8000',
  model: 'guard-model', timeoutMs: 3000, inputLimit: 4000, enabled: true,
  hasToken: true, tokenStatus: 'configured', token: '', clearToken: false,
} as PromptAuditEndpointDraft)

describe('Prompt Audit components', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('edits a saved endpoint with blank-secret keep, explicit clear, replacement, and probe actions', async () => {
    const wrapper = mount(EndpointPool, {
      props: { endpoints: [endpoint()], probeResults: {}, probingIds: [] },
      global: { stubs: { BaseDialog: DialogStub } },
    })
    expect(wrapper.text()).toContain('admin.promptAudit.pool.configured')
    const edit = wrapper.findAll('button').find((button) => button.text().includes('common.edit'))
    expect(edit).toBeTruthy()
    await edit!.trigger('click')
    const token = wrapper.get<HTMLInputElement>('[aria-label="admin.promptAudit.pool.apiKey"]')
    expect(token.element.value).toBe('')
    expect(token.attributes('placeholder')).toContain('admin.promptAudit.pool.keepSecret')

    await wrapper.get<HTMLInputElement>('[aria-label="admin.promptAudit.pool.clearSecret"]').setValue(true)
    await token.setValue('replacement-canary')
    await wrapper.get('[data-test="save-endpoint"]').trigger('click')
    const updated = wrapper.emitted('update:endpoints')?.at(-1)?.[0] as PromptAuditEndpointDraft[]
    expect(updated[0]).toMatchObject({ token: 'replacement-canary', clearToken: false })

    const probe = wrapper.findAll('button').find((button) => button.text().includes('admin.promptAudit.pool.probe'))
    await probe!.trigger('click')
    expect(wrapper.emitted('probe')?.[0]?.[0]).toMatchObject({ id: 'guard-1' })
  })

  it('supports group search, stale configured groups, nine scanners, and bounded worker inputs', async () => {
    const draft: PromptAuditDraft = {
      enabled: true, blockingEnabled: false, storePassEvents: false, effectiveMode: 'async_audit', strategy: 'priority',
      workerCount: 4, queueCapacity: 100, scanners: SCANNER_CATALOG.map((item) => item.id), allGroups: false, groupIds: [1, 99],
      endpoints: [endpoint()], configVersion: 1, updatedAt: '', updatedBy: 0, changeSummary: '',
    } as PromptAuditDraft
    const wrapper = mount(PolicyPanel, {
      props: { draft, groups: [{ id: 1, name: 'Alpha', platform: 'openai', status: 'active' }, { id: 2, name: 'Beta', platform: 'claude', status: 'inactive' }] },
    })
    expect(wrapper.text()).toContain('99')
    expect(wrapper.findAll('input[type="checkbox"]').filter((input) => SCANNER_CATALOG.some((scanner) => input.attributes('aria-label') === `admin.promptAudit.scanners.${scanner.id}`))).toHaveLength(9)
    await wrapper.get('[aria-label="admin.promptAudit.policy.searchGroups"]').setValue('Beta')
    expect(wrapper.text()).toContain('Beta')
    expect(wrapper.text()).not.toContain('Alpha')
    await wrapper.get('[aria-label="admin.promptAudit.policy.workerCount"]').setValue('6')
    const emitted = wrapper.emitted('update:draft')?.at(-1)?.[0] as PromptAuditDraft
    expect(emitted.workerCount).toBe(6)
  })

  it('keeps identity fields separate, supports selection, and opens filter deletion from the toolbar', async () => {
    const event: PromptAuditEvent = {
      id: 1, jobId: 1, decision: 'critical', riskLevel: 'critical', action: 'Block', categories: ['pii'], matchedScanners: ['pii'], scannerScores: { pii: 1 }, scannerEvidence: { pii: 'redacted' }, scannerBackend: 'qwen3guard-openai', scannerVersion: '1', guardEndpointId: 'guard-1', policyId: 'priority', policyVersion: 1, configVersion: 1, chunkTotal: 1, latencyMs: 10, issueSummaries: [], createdAt: '2026-07-16T00:00:00Z',
      snapshot: { requestId: 'req-1', userId: 1, username: 'alice', userEmail: 'alice@example.test', apiKeyId: 2, apiKeyName: 'alice-key', groupId: 3, groupName: 'Alpha', provider: 'openai', endpoint: '/v1/chat/completions', protocol: 'openai_chat', model: 'gpt-test', promptHash: 'a'.repeat(64), redactedPreview: 'redacted preview', fullPrompt: 'full prompt text', promptLength: 10, messageCount: 1, stage: 'http' },
    } as PromptAuditEvent
    const wrapper = mount(EventWorkspace, {
      props: { events: [event], total: 1, page: 1, pageSize: 20, filters: emptyEventFilters(), selectedIds: [], loading: false, error: '' },
      global: { stubs: { Pagination: PaginationStub } },
    })
    expect(wrapper.text()).toContain('alice')
    expect(wrapper.text()).toContain('alice@example.test')
    expect(wrapper.text()).toContain('alice-key')
    expect(wrapper.text()).toContain('admin.promptAudit.decisions.critical · admin.promptAudit.riskLevels.critical')
    expect(wrapper.text()).toContain('admin.promptAudit.scanners.pii')
    expect(wrapper.get('[data-test="filter-delete"]').attributes()).not.toHaveProperty('disabled')
    await wrapper.get('[data-test="filter-delete"]').trigger('click')
    expect(wrapper.emitted('preview-delete')).toHaveLength(1)
    await wrapper.get('[aria-label="admin.promptAudit.events.selectEvent"]').setValue(true)
    expect(wrapper.emitted('selection')?.at(-1)?.[0]).toEqual([1])
  })

  it('resolves delete range presets to an epoch start and a cutoff end', () => {
    const now = Date.parse('2026-07-17T12:00:00.000Z')
    const sevenDays = resolveDeleteRangeFilters(emptyEventFilters(), '7d', now)
    expect(sevenDays.startAt).toBe('1970-01-01T00:00:00.000Z')
    expect(sevenDays.endAt).toBe('2026-07-10T12:00:00.000Z')
    const all = resolveDeleteRangeFilters(emptyEventFilters(), 'all', now)
    expect(all.startAt).toBe('1970-01-01T00:00:00.000Z')
    expect(all.endAt).toBe('2026-07-17T12:00:00.000Z')
    const customSource = { ...emptyEventFilters(), startAt: '2026-07-01T00:00', endAt: '2026-07-02T00:00' }
    expect(resolveDeleteRangeFilters(customSource, 'custom', now)).toEqual(customSource)
  })

  it('drives filter deletion through presets, custom validation, preview, and confirm', async () => {
    const wrapper = mount(FilterDeleteDialog, {
      props: { show: true, initialFilters: emptyEventFilters(), preview: null, previewing: false, deleting: false },
      global: { stubs: { BaseDialog: DialogStub } },
    })
    expect(wrapper.get<HTMLInputElement>('[data-test="range-preset-7d"]').element.checked).toBe(true)
    expect(wrapper.find('[data-test="custom-range"]').exists()).toBe(false)
    expect(wrapper.get('[data-test="delete-preview-empty"]').exists()).toBeTruthy()
    expect(wrapper.get('[data-test="confirm-filter-delete"]').attributes()).not.toHaveProperty('disabled')
    expect(wrapper.find('[data-test="confirm-disabled-reason"]').exists()).toBe(false)
    await wrapper.get('[data-test="confirm-filter-delete"]').trigger('click')
    const directConfirm = wrapper.emitted('confirm')?.at(-1)?.[0] as PromptEventFilters
    expect(directConfirm.startAt).toBe('1970-01-01T00:00:00.000Z')
    expect(Date.now() - new Date(directConfirm.endAt).getTime()).toBeGreaterThanOrEqual(7 * 24 * 60 * 60 * 1000)

    await wrapper.get('[data-test="range-preset-30d"]').setValue()
    expect(wrapper.emitted('criteria-change')?.length).toBeGreaterThan(0)
    await wrapper.get('[data-test="delete-risk"]').setValue('high')
    await wrapper.get('[data-test="run-delete-preview"]').trigger('click')
    const presetPreview = wrapper.emitted('preview')?.at(-1)?.[0] as PromptEventFilters
    expect(presetPreview.riskLevel).toBe('high')
    expect(presetPreview.startAt).toBe('1970-01-01T00:00:00.000Z')
    expect(Date.now() - new Date(presetPreview.endAt).getTime()).toBeGreaterThanOrEqual(30 * 24 * 60 * 60 * 1000)

    await wrapper.get('[data-test="range-preset-custom"]').setValue()
    expect(wrapper.find('[data-test="custom-range"]').exists()).toBe(true)
    expect(wrapper.get('[data-test="run-delete-preview"]').attributes()).toHaveProperty('disabled')
    expect(wrapper.get('[data-test="confirm-filter-delete"]').attributes()).toHaveProperty('disabled')
    expect(wrapper.get('[data-test="confirm-disabled-reason"]').text()).toBe('admin.promptAudit.events.filterDeleteConfirmInvalidRange')
    await wrapper.get('[data-test="custom-range"] [aria-label="admin.promptAudit.events.startAt"]').setValue('2026-07-01T00:00')
    await wrapper.get('[data-test="custom-range"] [aria-label="admin.promptAudit.events.endAt"]').setValue('2026-07-02T00:00')
    expect(wrapper.get('[data-test="run-delete-preview"]').attributes()).not.toHaveProperty('disabled')
    expect(wrapper.get('[data-test="confirm-filter-delete"]').attributes()).not.toHaveProperty('disabled')
    await wrapper.get('[data-test="run-delete-preview"]').trigger('click')
    const customPreview = wrapper.emitted('preview')?.at(-1)?.[0] as PromptEventFilters
    expect(customPreview.startAt).toBe('2026-07-01T00:00')
    expect(customPreview.endAt).toBe('2026-07-02T00:00')

    await wrapper.setProps({
      preview: { matchedCount: 3, filterSummary: {}, snapshotMaxId: 9, filterHash: 'b'.repeat(64), confirmationToken: 'tok', expiresAt: '2026-07-16T00:05:00Z' },
    })
    expect(wrapper.get('[data-test="delete-preview-result"]').text()).toContain('admin.promptAudit.events.filterDeleteCount')
    expect(wrapper.get('[data-test="confirm-filter-delete"]').attributes()).not.toHaveProperty('disabled')
    await wrapper.get('[data-test="confirm-filter-delete"]').trigger('click')
    const confirmed = wrapper.emitted('confirm')?.at(-1)?.[0] as PromptEventFilters
    expect(confirmed.startAt).toBe('2026-07-01T00:00')
    expect(confirmed.endAt).toBe('2026-07-02T00:00')
  })

  it('explains that a zero-match preview leaves nothing to delete', async () => {
    const wrapper = mount(FilterDeleteDialog, {
      props: {
        show: true, initialFilters: emptyEventFilters(),
        preview: { matchedCount: 0, filterSummary: {}, snapshotMaxId: 0, filterHash: 'c'.repeat(64), confirmationToken: 'tok', expiresAt: '2026-07-16T00:05:00Z' },
        previewing: false, deleting: false,
      },
      global: { stubs: { BaseDialog: DialogStub } },
    })
    expect(wrapper.get('[data-test="confirm-filter-delete"]').attributes()).toHaveProperty('disabled')
    expect(wrapper.get('[data-test="confirm-disabled-reason"]').text()).toBe('admin.promptAudit.events.filterDeleteConfirmNoMatches')
    await wrapper.setProps({ previewing: true })
    expect(wrapper.find('[data-test="confirm-disabled-reason"]').exists()).toBe(false)
    expect(wrapper.get('[data-test="confirm-filter-delete"]').attributes()).toHaveProperty('disabled')
  })

  it('inherits an explicit list-filter range as the custom preset', async () => {
    const initialFilters = { ...emptyEventFilters(), startAt: '2026-07-01T00:00', endAt: '2026-07-02T00:00', decision: 'critical' }
    const wrapper = mount(FilterDeleteDialog, {
      props: { show: true, initialFilters, preview: null, previewing: false, deleting: false },
      global: { stubs: { BaseDialog: DialogStub } },
    })
    expect(wrapper.get<HTMLInputElement>('[data-test="range-preset-custom"]').element.checked).toBe(true)
    expect(wrapper.get<HTMLInputElement>('[data-test="custom-range"] [aria-label="admin.promptAudit.events.startAt"]').element.value).toBe('2026-07-01T00:00')
    expect(wrapper.get<HTMLSelectElement>('[data-test="delete-decision"]').element.value).toBe('critical')
    expect(wrapper.get('[data-test="run-delete-preview"]').attributes()).not.toHaveProperty('disabled')
  })

  it('shows the full unredacted prompt and structured guard return on the risks tab', async () => {
    const event: PromptAuditEvent = {
      id: 1, jobId: 1, decision: 'critical', riskLevel: 'critical', action: 'Block',
      categories: ['sexual_content_or_sexual_acts'], matchedScanners: ['sexual_content_or_sexual_acts'],
      scannerScores: { sexual_content_or_sexual_acts: 1 },
      scannerEvidence: { sexual_content_or_sexual_acts: 'Sexual Content or Sexual Acts' },
      scannerBackend: 'qwen3guard-openai', scannerVersion: 'qwen3guard', guardEndpointId: 'guard-1',
      policyId: 'priority', policyVersion: 1, configVersion: 1, chunkTotal: 1, latencyMs: 12,
      issueSummaries: [{
        category: 'sexual_content_or_sexual_acts', scannerId: 'sexual_content_or_sexual_acts',
        title: '性内容或性行为', description: 'Sexual content or sexual acts', severity: 'critical',
        severityLabel: '严重', action: 'Block', actionLabel: '阻止',
        code: 'prompt_audit_sexual_content_or_sexual_acts', score: 1,
        evidence: 'Sexual Content or Sexual Acts', evidenceHash: 'abc',
      }],
      createdAt: '2026-07-16T00:00:00Z',
      snapshot: {
        requestId: 'req-1', userId: 1, username: 'alice', userEmail: 'alice@example.test',
        apiKeyId: 2, apiKeyName: 'alice-key', groupId: 3, groupName: 'Alpha', provider: 'openai',
        endpoint: '/v1/chat/completions', protocol: 'openai_chat', model: 'gpt-test',
        promptHash: 'a'.repeat(64), redactedPreview: 'redacted prompt body', fullPrompt: 'complete unmasked prompt body', promptLength: 20,
        messageCount: 1, stage: 'http',
      },
    } as PromptAuditEvent
    const wrapper = mount(EventDetailDialog, {
      props: { show: true, event, loading: false },
      global: { stubs: { BaseDialog: DialogStub } },
    })
    const panel = wrapper.get('[data-test="event-detail-tab-panel"]')
    expect(panel.classes()).toContain('h-[min(62vh,36rem)]')
    expect(panel.classes()).toContain('overflow-y-auto')

    const riskTab = wrapper.findAll('[role="tab"]').find((tab) => tab.text().includes('admin.promptAudit.events.tabs.risks'))
    expect(riskTab).toBeTruthy()
    await riskTab!.trigger('click')
    expect(wrapper.get('[data-test="risk-prompt-preview"]').text()).toContain('complete unmasked prompt body')
    expect(wrapper.get('[data-test="risk-prompt-preview"]').text()).not.toContain('redacted prompt body')
    expect(wrapper.get('[data-test="risk-guard-return"]').text()).toContain('"decision": "admin.promptAudit.decisions.critical"')
    expect(wrapper.get('[data-test="risk-guard-return"]').text()).toContain('admin.promptAudit.scanners.sexual_content_or_sexual_acts')
    expect(wrapper.get('[data-test="risk-issue"]').text()).toContain('admin.promptAudit.scanners.sexual_content_or_sexual_acts')
  })

  it('falls back to the redacted preview for events stored before full prompts were kept', async () => {
    const event: PromptAuditEvent = {
      id: 2, jobId: 2, decision: 'flag', riskLevel: 'medium', action: 'Warn',
      categories: ['pii'], matchedScanners: ['pii'], scannerScores: {}, scannerEvidence: {},
      scannerBackend: 'qwen3guard-openai', scannerVersion: '1', guardEndpointId: 'guard-1',
      policyId: 'priority', policyVersion: 1, configVersion: 1, chunkTotal: 1, latencyMs: 5,
      issueSummaries: [], createdAt: '2026-07-16T00:00:00Z',
      snapshot: {
        requestId: 'req-2', userId: 1, username: 'bob', userEmail: '', apiKeyId: 2,
        apiKeyName: 'bob-key', groupId: 3, groupName: 'Alpha', provider: 'openai',
        endpoint: '/v1/chat/completions', protocol: 'openai_chat', model: 'gpt-test',
        promptHash: 'b'.repeat(64), redactedPreview: 'legacy redacted preview', fullPrompt: '', promptLength: 20,
        messageCount: 1, stage: 'http',
      },
    } as PromptAuditEvent
    const wrapper = mount(EventDetailDialog, {
      props: { show: true, event, loading: false },
      global: { stubs: { BaseDialog: DialogStub } },
    })
    const riskTab = wrapper.findAll('[role="tab"]').find((tab) => tab.text().includes('admin.promptAudit.events.tabs.risks'))
    await riskTab!.trigger('click')
    expect(wrapper.get('[data-test="risk-prompt-full"]').text()).toContain('legacy redacted preview')
  })
})
