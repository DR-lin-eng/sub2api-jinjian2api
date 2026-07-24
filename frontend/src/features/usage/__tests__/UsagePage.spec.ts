import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import UsagePage from '@/features/usage/presentation/pages/UsagePage.vue'

const {
  query,
  getStats,
  getDashboardModels,
  getDashboardSnapshotV2,
  list,
  getAvailable,
  showError,
  showWarning,
  showSuccess,
  showInfo,
  appStoreState,
} = vi.hoisted(() => ({
  query: vi.fn(),
  getStats: vi.fn(),
  getDashboardModels: vi.fn(),
  getDashboardSnapshotV2: vi.fn(),
  list: vi.fn(),
  getAvailable: vi.fn(),
  showError: vi.fn(),
  showWarning: vi.fn(),
  showSuccess: vi.fn(),
  showInfo: vi.fn(),
  appStoreState: {
    cachedPublicSettings: null as null | { allow_user_view_usage_details?: boolean },
  },
}))

const messages: Record<string, string> = {
  'admin.dashboard.timeRange': 'Time range',
  'admin.dashboard.granularity': 'Granularity',
  'admin.dashboard.day': 'Day',
  'admin.dashboard.hour': 'Hour',
  'admin.users.columnSettings': 'Columns',
  'admin.usage.group': 'Group',
  'admin.usage.billingType': 'Billing type',
  'admin.usage.billingMode': 'Billing mode',
  'admin.usage.allTypes': 'All types',
  'admin.usage.allBillingTypes': 'All billing types',
  'admin.usage.billingTypeBalance': 'Balance',
  'admin.usage.billingTypeSubscription': 'Subscription',
  'admin.usage.allBillingModes': 'All billing modes',
  'admin.usage.billingModeToken': 'Token',
  'admin.usage.billingModePerRequest': 'Per request',
  'admin.usage.billingModeImage': 'Image',
  'admin.usage.allGroups': 'All groups',
  'admin.usage.allModels': 'All models',
  'usage.allApiKeys': 'All API Keys',
  'usage.apiKeyFilter': 'API Key',
  'usage.model': 'Model',
  'usage.type': 'Type',
  'usage.ws': 'WS',
  'usage.stream': 'Stream',
  'usage.sync': 'Sync',
  'usage.exporting': 'Exporting',
  'usage.exportCsv': 'Export CSV',
  'usage.failedToLoad': 'Failed to load',
  'usage.noDataToExport': 'No data',
  'usage.preparingExport': 'Preparing export',
  'usage.exportSuccess': 'Export success',
  'usage.exportFailed': 'Export failed',
  'common.refresh': 'Refresh',
  'common.reset': 'Reset',
}

vi.mock('@/features/usage/presentation/stores/usageQueryStore', () => ({
  useUsageQueryStore: () => ({
    loading: {},
    errors: {},
    query,
    getStats,
    getDashboardModels,
    getDashboardSnapshotV2,
    listMyErrorRequests: vi.fn().mockResolvedValue({ items: [], total: 0 }),
    getMyErrorDetail: vi.fn(),
  }),
  createUsageQueryStore: vi.fn(),
}))

vi.mock('@/api', () => ({
  userGroupsAPI: {
    getAvailable,
  },
}))

vi.mock('@/features/keys/presentation/stores/keysQueryStore', () => ({
  useKeysQueryStore: () => ({
    loading: { list: false, getById: false },
    errors: { list: null, getById: null },
    list,
    getById: vi.fn(),
  }),
}))

vi.mock('@/core/stores/appStore', () => ({
  useAppStore: () => ({
    showError,
    showWarning,
    showSuccess,
    showInfo,
    cachedPublicSettings: appStoreState.cachedPublicSettings,
  }),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => messages[key] ?? key,
    }),
  }
})

const simpleStub = { template: '<div><slot /></div>' }
const chartStub = { template: '<div />' }
const usageTableStub = {
  name: 'UsageTable',
  props: ['columns'],
  template: '<div data-testid="usage-table" />',
}

const usageLog = {
  id: 1,
  requestId: 'req-user-export',
  actualCost: 0.092883,
  totalCost: 0.092883,
  rateMultiplier: 1,
  serviceTier: 'priority',
  inputCost: 0.020285,
  outputCost: 0.00303,
  cacheCreationCost: 0.000001,
  cacheReadCost: 0.069568,
  inputTokens: 4057,
  outputTokens: 101,
  cacheCreationTokens: 4,
  cacheReadTokens: 278272,
  cacheCreation5mTokens: 0,
  cacheCreation1hTokens: 0,
  imageCount: 0,
  imageSize: '',
  firstTokenMs: 12,
  durationMs: 345,
  createdAt: '2026-03-08T00:00:00Z',
  model: 'gpt-5.4',
  reasoningEffort: '',
  ipAddress: '203.0.113.10',
  apiKey: { name: 'demo-key' },
  billingMode: 'token',
  requestType: 'sync',
  stream: false,
  inboundEndpoint: '',
  upstreamEndpoint: '',
  groupId: 0,
  userId: 0,
  apiKeyId: 0,
  accountId: 0,
  subscriptionId: 0,
  longContextBillingApplied: false,
  billingType: 0,
  userAgent: '',
  cacheTtlOverridden: false,
  imageSizeBreakdown: {},
  imageSizeSource: '',
  imageInputSize: '',
  imageOutputSize: '',
  imageInputTokens: 0,
  imageInputCost: 0,
  imageOutputTokens: 0,
  imageOutputCost: 0,
  videoCount: 0,
  videoResolution: '',
  videoDurationSeconds: 0,
}

function mountUsagePage() {
  return mount(UsagePage, {
    global: {
      stubs: {
        AppLayout: simpleStub,
        Pagination: true,
        Select: true,
        DateRangePicker: true,
        Icon: true,
        UsageStatsCards: chartStub,
        UsageTable: usageTableStub,
        ModelDistributionChart: chartStub,
        GroupDistributionChart: chartStub,
        EndpointDistributionChart: chartStub,
        TokenUsageTrend: chartStub,
      },
    },
  })
}

describe('user UsagePage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    query.mockReset()
    getStats.mockReset()
    getDashboardModels.mockReset()
    getDashboardSnapshotV2.mockReset()
    list.mockReset()
    getAvailable.mockReset()
    showError.mockReset()
    showWarning.mockReset()
    showSuccess.mockReset()
    showInfo.mockReset()
    appStoreState.cachedPublicSettings = null

    query.mockResolvedValue({ items: [usageLog], total: 1, pages: 1 })
    getStats.mockResolvedValue({
      total_requests: 1,
      total_input_tokens: 10,
      total_output_tokens: 20,
      total_cache_tokens: 0,
      total_tokens: 30,
      total_cost: 0.1,
      total_actual_cost: 0.08,
      average_duration_ms: 12,
      endpoints: [],
      upstream_endpoints: [],
      endpoint_paths: [],
    })
    getDashboardModels.mockResolvedValue({
      models: [{ model: 'gpt-5.4', requests: 1, input_tokens: 10, output_tokens: 20, cache_creation_tokens: 0, cache_read_tokens: 0, total_tokens: 30, cost: 0.1, actual_cost: 0.08 }],
      start_date: '2026-03-08',
      end_date: '2026-03-08',
    })
    getDashboardSnapshotV2.mockResolvedValue({
      generated_at: '2026-03-08T00:00:00Z',
      start_date: '2026-03-08',
      end_date: '2026-03-08',
      granularity: 'hour',
      trend: [],
      groups: [],
    })
    list.mockResolvedValue({ items: [{ id: 1, name: 'demo-key' }] })
    getAvailable.mockResolvedValue([{ id: 1, name: 'default' }])
  })

  it('loads logs, stats, model stats, and snapshot on first render', async () => {
    mountUsagePage()
    await flushPromises()

    expect(query).toHaveBeenCalled()
    expect(getStats).toHaveBeenCalled()
    expect(getDashboardModels).toHaveBeenCalled()
    expect(getDashboardSnapshotV2).toHaveBeenCalledWith(expect.objectContaining({
      include_trend: true,
      include_model_stats: false,
      include_group_stats: true,
    }))
    expect(list).toHaveBeenCalledWith(1, 100)
    expect(getAvailable).toHaveBeenCalled()
  })

  it('hides usage details by default and exposes the action only when enabled globally', async () => {
    const disabledWrapper = mountUsagePage()
    await flushPromises()
    expect(disabledWrapper.getComponent({ name: 'UsageTable' }).props('columns'))
      .not.toEqual(expect.arrayContaining([expect.objectContaining({ key: 'actions' })]))

    appStoreState.cachedPublicSettings = { allow_user_view_usage_details: true }
    const enabledWrapper = mountUsagePage()
    await flushPromises()
    expect(enabledWrapper.getComponent({ name: 'UsageTable' }).props('columns'))
      .toEqual(expect.arrayContaining([expect.objectContaining({ key: 'actions' })]))
  })

  it('exports csv with current filters and without admin-only fields', async () => {
    const wrapper = mountUsagePage()
    await flushPromises()

    let exportedBlob: Blob | null = null
    let csvContent = ''
    const OriginalBlob = globalThis.Blob
    vi.stubGlobal('Blob', vi.fn((parts: BlobPart[], options?: BlobPropertyBag) => {
      csvContent = parts.map((part) => String(part)).join('')
      return new OriginalBlob(parts, options)
    }))
    const originalCreateObjectURL = window.URL.createObjectURL
    const originalRevokeObjectURL = window.URL.revokeObjectURL
    window.URL.createObjectURL = vi.fn((blob: Blob | MediaSource) => {
      exportedBlob = blob as Blob
      return 'blob:usage-export'
    }) as typeof window.URL.createObjectURL
    window.URL.revokeObjectURL = vi.fn(() => {}) as typeof window.URL.revokeObjectURL
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await (wrapper.vm as any).exportToCSV()

    expect(exportedBlob).not.toBeNull()
    expect(query).toHaveBeenCalledWith(expect.objectContaining({
      pageSize: 100,
      sortBy: 'created_at',
      sortOrder: 'desc',
    }), expect.any(Object))
    expect(clickSpy).toHaveBeenCalled()
    expect(showSuccess).toHaveBeenCalled()
    expect(csvContent.startsWith('\uFEFF')).toBe(true)
    expect(csvContent.slice(1)).toBe([
      'Time,API Key Name,Model,Reasoning Effort,Inbound Endpoint,IP Address,Type,Billing Mode,Input Tokens,Output Tokens,Cache Read Tokens,Cache Creation Tokens,Rate Multiplier,Billed Cost,Original Cost,First Token (ms),Duration (ms),Output Speed (tokens/s)',
      '2026-03-08T00:00:00Z,demo-key,gpt-5.4,"\'-",,203.0.113.10,Sync,Token,4057,101,278272,4,1,0.09288300,0.09288300,12,345,293',
    ].join('\n'))
    expect(csvContent).toContain('IP Address')
    expect(csvContent).toContain('203.0.113.10')
    expect(csvContent).toContain('Billed Cost')
    expect(csvContent).toContain('Original Cost')
    expect(csvContent).not.toContain('Upstream Endpoint')
    expect(csvContent).not.toContain('account_cost')
    expect(csvContent).not.toContain('account_rate_multiplier')

    window.URL.createObjectURL = originalCreateObjectURL
    window.URL.revokeObjectURL = originalRevokeObjectURL
    vi.unstubAllGlobals()
    clickSpy.mockRestore()
  })

  it('exports historical image rows with image billing mode derived from image_count', async () => {
    query.mockResolvedValue({
      items: [
        {
          ...usageLog,
          requestId: 'req-user-export-legacy-image',
          actualCost: 0.2,
          totalCost: 0.2,
          inputCost: 0,
          outputCost: 0,
          cacheCreationCost: 0,
          cacheReadCost: 0,
          inputTokens: 0,
          outputTokens: 0,
          cacheCreationTokens: 0,
          cacheReadTokens: 0,
          imageCount: 1,
          model: 'gpt-image-2',
          billingMode: '',
          ipAddress: '',
        },
      ],
      total: 1,
      pages: 1,
    })

    const wrapper = mountUsagePage()
    await flushPromises()

    let csvContent = ''
    const OriginalBlob = globalThis.Blob
    vi.stubGlobal('Blob', vi.fn((parts: BlobPart[], options?: BlobPropertyBag) => {
      csvContent = parts.map((part) => String(part)).join('')
      return new OriginalBlob(parts, options)
    }))
    const originalCreateObjectURL = window.URL.createObjectURL
    const originalRevokeObjectURL = window.URL.revokeObjectURL
    window.URL.createObjectURL = vi.fn(() => 'blob:usage-export') as typeof window.URL.createObjectURL
    window.URL.revokeObjectURL = vi.fn(() => {}) as typeof window.URL.revokeObjectURL
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await (wrapper.vm as any).exportToCSV()

    expect(csvContent).toContain('Billing Mode')
    expect(csvContent).toContain('Image')
    expect(csvContent).not.toContain(',Token,0,0,0,0,')

    window.URL.createObjectURL = originalCreateObjectURL
    window.URL.revokeObjectURL = originalRevokeObjectURL
    vi.unstubAllGlobals()
    clickSpy.mockRestore()
  })
})
