import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import type { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import type { PromptAuditRuntime } from '@/features/prompt-audit/domain/models/promptAuditRuntime'
import { SCANNER_CATALOG } from '@/features/prompt-audit/presentation/utils/promptAuditViewModel'
import PromptAuditPage from '@/features/prompt-audit/presentation/pages/PromptAuditPage.vue'

const mocks = vi.hoisted(() => ({
  getConfig: vi.fn(), updateConfig: vi.fn(), probeEndpoint: vi.fn(), getRuntime: vi.fn(), listEvents: vi.fn(),
  getEvent: vi.fn(), deleteEvent: vi.fn(), batchDeleteEvents: vi.fn(), previewDelete: vi.fn(), deleteEventsByFilter: vi.fn(), listGroups: vi.fn(),
  showSuccess: vi.fn(), showError: vi.fn(),
}))

vi.mock('@/features/prompt-audit/data/datasources/promptAuditQueryDatasource', () => ({
  promptAuditQueryDatasource: {
    getConfig: mocks.getConfig,
    getRuntime: mocks.getRuntime,
    listEvents: mocks.listEvents,
    getEvent: mocks.getEvent,
    previewDelete: mocks.previewDelete,
    listGroups: mocks.listGroups,
  },
}))
vi.mock('@/features/prompt-audit/data/datasources/promptAuditActionDatasource', () => ({
  promptAuditActionDatasource: {
    updateConfig: mocks.updateConfig,
    probeEndpoint: mocks.probeEndpoint,
    deleteEvent: mocks.deleteEvent,
    batchDeleteEvents: mocks.batchDeleteEvents,
    deleteEventsByFilter: mocks.deleteEventsByFilter,
  },
}))
vi.mock('@/core/stores/appStore', () => ({ useAppStore: () => ({ showSuccess: mocks.showSuccess, showError: mocks.showError }) }))
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return { ...actual, useI18n: () => ({ locale: { value: 'en' }, t: (key: string, params?: Record<string, unknown>) => key.replace(/\{(\w+)\}/g, (_, token) => String(params?.[token] ?? `{${token}}`)) }) }
})

const baseConfig = (): PromptAuditConfig => ({
  enabled: true, blockingEnabled: false, storePassEvents: false, effectiveMode: 'async_audit', strategy: 'priority',
  workerCount: 4, queueCapacity: 100, scanners: SCANNER_CATALOG.map((item) => item.id), allGroups: true, groupIds: [],
  endpoints: [{ id: 'guard-1', name: 'Guard One', protocol: 'openai_compatible', baseUrl: 'http://127.0.0.1:8000', model: 'guard-model', timeoutMs: 3000, inputLimit: 4000, enabled: true, hasToken: true, tokenStatus: 'configured' }],
  configVersion: 7, updatedAt: '2026-07-16T00:00:00Z', updatedBy: 1, changeSummary: '{}',
} as PromptAuditConfig)

const makeRuntime = (): PromptAuditRuntime => ({
  processStatus: 'running', effectiveMode: 'async_audit', expectedConfigVersion: 7, activeConfigVersion: 7,
  workerTotal: 4, workerActive: 1, queueCapacity: 100,
  queue: { staging: 0, queued: 0, processing: 1, retry: 0, done: 5, failed: 0, active: 1 },
  processedTotal: 5, failedTotal: 0, enqueuedTotal: 5, droppedTotal: 0, databaseStatus: 'ok', redisStatus: 'ok', endpoints: {},
  guardMetrics: { total: 1, allowed: 1, flagged: 0, blocked: 0, unavailable: 0, invalid: 0, timeouts: 0, failovers: 0, bulkheadFull: 0, recordFailed: 0 },
} as PromptAuditRuntime)

// Datasource mocks return raw JSON; the Impl's toEntity() converts them.
// We bypass toEntity() by having the mock return an already-shaped entity.
// Since RepositoryImpl uses lazy getters over the mocked ds.* functions,
// the mock just needs to resolve with the right shape.
const AppLayoutStub = { template: '<div><slot /></div>' }
const RuntimeStub = defineComponent({ props: ['runtime', 'loading', 'error'], emits: ['refresh'], template: '<div data-test="runtime">{{ error }}</div>' })
const EndpointStub = defineComponent({
  props: ['endpoints', 'probeResults', 'probingIds'], emits: ['update:endpoints', 'probe'],
  template: '<div data-test="endpoint"><button data-test="inject-secret" @click="$emit(\'update:endpoints\', endpoints.map((e) => ({ ...e, token: \'PROMPT_AUDIT_CANARY_SECRET_DO_NOT_PERSIST\' })))">secret</button><button data-test="probe" @click="$emit(\'probe\', endpoints[0])">probe</button></div>',
})
const PolicyStub = defineComponent({ props: ['draft', 'groups'], emits: ['update:draft'], template: '<div data-test="policy" />' })
const EventsStub = defineComponent({
  props: ['events', 'filters', 'selectedIds', 'loading', 'error', 'total', 'page', 'pageSize'],
  emits: ['filters-change', 'search', 'selection', 'page', 'page-size', 'view', 'delete', 'batch-delete', 'preview-delete'],
  template: '<div data-test="events"><button data-test="preview" @click="$emit(\'preview-delete\')">preview</button><button data-test="change-filter" @click="$emit(\'filters-change\', { ...filters, keyword: \'changed\' })">change</button><button data-test="delete-one" @click="$emit(\'delete\', 5)">delete</button><button data-test="select-batch" @click="$emit(\'selection\', [5, 6])">select</button><button data-test="delete-batch" @click="$emit(\'batch-delete\')">batch</button></div>',
})
const DetailStub = defineComponent({ props: ['show', 'event', 'loading'], emits: ['close'], template: '<div data-test="detail" />' })
const ConfirmStub = defineComponent({ props: ['show', 'title', 'message'], emits: ['confirm', 'cancel'], template: '<div v-if="show" data-test="confirm"><button data-test="confirm-action" @click="$emit(\'confirm\')">confirm</button></div>' })
const FilterDeleteStub = defineComponent({
  props: ['show', 'initialFilters', 'preview', 'previewing', 'deleting'],
  emits: ['close', 'preview', 'confirm', 'criteria-change'],
  template: '<div v-if="show" data-test="filter-delete-dialog"><button data-test="dialog-preview" @click="$emit(\'preview\', { ...initialFilters, startAt: \'2026-07-15T00:00\', endAt: \'2026-07-16T00:00\' })">run</button><button data-test="dialog-confirm" @click="$emit(\'confirm\', { ...initialFilters, startAt: \'2026-07-15T00:00\', endAt: \'2026-07-16T00:00\' })">confirm</button><span data-test="dialog-preview-state">{{ preview ? preview.matchedCount : \'none\' }}</span></div>',
})

function mountView() {
  return mount(PromptAuditPage, {
    global: {
      plugins: [createPinia()],
      stubs: { AppLayout: AppLayoutStub, RuntimeOverview: RuntimeStub, EndpointPool: EndpointStub, PolicyPanel: PolicyStub, EventWorkspace: EventsStub, EventDetailDialog: DetailStub, FilterDeleteDialog: FilterDeleteStub, ConfirmDialog: ConfirmStub },
    },
  })
}

// The datasource mocks return raw objects. The RepositoryImpl calls .toEntity()
// on the DTO result. We need the mocks to return DTO-shaped objects so toEntity works,
// OR we mock at the repository level. Since the impls use lazy getters over the ds module,
// mocking the datasource is the right level. We make the mock return a plain object
// that has a toEntity() method returning the desired entity.
function dtoWrap<T>(entity: T) {
  return { toEntity: () => entity, ...entity }
}
function dtoArrayWrap<T>(items: T[]) {
  return items.map((item) => dtoWrap(item))
}

describe('PromptAuditPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    Object.values(mocks).forEach((mock) => mock.mockReset())
    mocks.getConfig.mockResolvedValue(dtoWrap(baseConfig()))
    mocks.getRuntime.mockResolvedValue(dtoWrap(makeRuntime()))
    mocks.listGroups.mockResolvedValue([])
    mocks.listEvents.mockResolvedValue(dtoWrap({ items: [], total: 0, page: 1, pageSize: 20, pages: 0 }))
    mocks.updateConfig.mockImplementation(async () => dtoWrap({ ...baseConfig(), configVersion: 8 }))
    mocks.probeEndpoint.mockResolvedValue(dtoWrap({ ok: true, status: 'healthy', message: 'ok', latencyMs: 2, httpStatus: 200, retryable: false, checkedAt: '2026-07-16T00:00:00Z', tokenApplied: true }))
    mocks.previewDelete.mockResolvedValue(dtoWrap({ matchedCount: 2, filterSummary: {}, snapshotMaxId: 10, filterHash: 'a'.repeat(64), confirmationToken: 'opaque-confirmation', expiresAt: '2026-07-16T00:05:00Z' }))
    mocks.deleteEventsByFilter.mockResolvedValue(dtoWrap({ deletedEvents: 2, deletedJobs: 2 }))
    mocks.deleteEvent.mockResolvedValue(dtoWrap({ deletedEvents: 1, deletedJobs: 1 }))
    mocks.batchDeleteEvents.mockResolvedValue(dtoWrap({ deletedEvents: 2, deletedJobs: 2 }))
  })

  it('starts config, runtime, groups, and events loads independently', async () => {
    mocks.getRuntime.mockRejectedValue(new Error('runtime offline'))
    const wrapper = mountView()
    expect(mocks.getConfig).toHaveBeenCalledOnce()
    expect(mocks.getRuntime).toHaveBeenCalledOnce()
    expect(mocks.listGroups).toHaveBeenCalledOnce()
    expect(mocks.listEvents).toHaveBeenCalledOnce()
    await flushPromises()
    expect(wrapper.get('[data-test="runtime"]').text()).toContain('runtime offline')
    expect(wrapper.find('[data-test="endpoint"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="events"]').exists()).toBe(true)
  })

  it('separates configuration and audit events into page tabs', async () => {
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.get('[data-test="tab-events"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.get('[data-test="tab-config"]').attributes('aria-selected')).toBe('false')
    expect(wrapper.find('[data-test="save-config"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="events"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="pass-events-disabled-notice"]').exists()).toBe(true)

    await wrapper.get('[data-test="tab-config"]').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-test="tab-config"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-test="save-config"]').exists()).toBe(true)

    await wrapper.get('[data-test="tab-events"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-test="save-config"]').exists()).toBe(false)

    await wrapper.get('[data-test="pass-events-disabled-notice"] button').trigger('click')
    expect(wrapper.get('[data-test="tab-config"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-test="save-config"]').exists()).toBe(true)
  })

  it('requires confirmation for blocking and disables it when audit is turned off', async () => {
    const wrapper = mountView()
    await flushPromises()
    await wrapper.get('[data-test="tab-config"]').trigger('click')
    await wrapper.get('[data-test="blocking-toggle"]').trigger('click')
    expect(wrapper.find('[data-test="confirm"]').exists()).toBe(true)
    await wrapper.get('[data-test="confirm-action"]').trigger('click')
    expect(wrapper.get('[data-test="blocking-toggle"]').attributes('aria-checked')).toBe('true')
    await wrapper.get('[data-test="enabled-toggle"]').trigger('click')
    expect(wrapper.get('[data-test="enabled-toggle"]').attributes('aria-checked')).toBe('false')
    expect(wrapper.get('[data-test="blocking-toggle"]').attributes('aria-checked')).toBe('false')
    expect(wrapper.get('[data-test="blocking-toggle"]').attributes()).toHaveProperty('disabled')
  })

  it('clears plaintext token state after a successful save', async () => {
    const wrapper = mountView()
    await flushPromises()
    await wrapper.get('[data-test="tab-config"]').trigger('click')
    await wrapper.get('[data-test="inject-secret"]').trigger('click')
    expect(wrapper.text()).toContain('admin.promptAudit.saveBar.dirty')
    await wrapper.get('[data-test="save-config"]').trigger('click')
    await flushPromises()
    expect(mocks.updateConfig).toHaveBeenCalledWith(expect.objectContaining({ endpoints: [expect.objectContaining({ token: 'PROMPT_AUDIT_CANARY_SECRET_DO_NOT_PERSIST' })] }))
    const endpointProps = wrapper.getComponent(EndpointStub).props('endpoints') as Array<{ token: string }>
    expect(endpointProps[0].token).toBe('')
    expect(wrapper.html()).not.toContain('PROMPT_AUDIT_CANARY_SECRET_DO_NOT_PERSIST')
  })

  it('executes single, selected-batch, and preview-confirmed filter deletion flows', async () => {
    const wrapper = mountView()
    await flushPromises()

    await wrapper.get('[data-test="delete-one"]').trigger('click')
    await wrapper.get('[data-test="confirm-action"]').trigger('click')
    await flushPromises()
    expect(mocks.deleteEvent).toHaveBeenCalledWith(5)

    await wrapper.get('[data-test="select-batch"]').trigger('click')
    await wrapper.get('[data-test="delete-batch"]').trigger('click')
    await wrapper.get('[data-test="confirm-action"]').trigger('click')
    await flushPromises()
    expect(mocks.batchDeleteEvents).toHaveBeenCalledWith([5, 6])

    await wrapper.get('[data-test="preview"]').trigger('click')
    await flushPromises()
    await wrapper.get('[data-test="dialog-preview"]').trigger('click')
    await flushPromises()
    expect(mocks.previewDelete).toHaveBeenCalledWith(expect.objectContaining({ startAt: '2026-07-15T00:00', endAt: '2026-07-16T00:00' }))
    await wrapper.get('[data-test="dialog-confirm"]').trigger('click')
    await flushPromises()
    expect(mocks.deleteEventsByFilter).toHaveBeenCalledWith(
      expect.objectContaining({ startAt: '2026-07-15T00:00', endAt: '2026-07-16T00:00' }),
      expect.objectContaining({ snapshotMaxId: 10, confirmationToken: 'opaque-confirmation' }),
    )
    expect(wrapper.find('[data-test="filter-delete-dialog"]').exists()).toBe(false)
  })

  it('mints the confirmation token on the fly for one-click filter deletion without a manual preview', async () => {
    const wrapper = mountView()
    await flushPromises()

    await wrapper.get('[data-test="preview"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-test="filter-delete-dialog"]').exists()).toBe(true)
    expect(mocks.previewDelete).not.toHaveBeenCalled()

    await wrapper.get('[data-test="dialog-confirm"]').trigger('click')
    await flushPromises()
    expect(mocks.previewDelete).toHaveBeenCalledOnce()
    expect(mocks.deleteEventsByFilter).toHaveBeenCalledWith(
      expect.objectContaining({ startAt: '2026-07-15T00:00', endAt: '2026-07-16T00:00' }),
      expect.objectContaining({ snapshotMaxId: 10, confirmationToken: 'opaque-confirmation' }),
    )
    expect(wrapper.find('[data-test="filter-delete-dialog"]').exists()).toBe(false)
  })
})
