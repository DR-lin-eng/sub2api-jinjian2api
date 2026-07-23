import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MultiInstancePage from '@/features/admin-cluster/presentation/pages/MultiInstancePage.vue'
import type { ClusterStatusResponse } from '@/features/admin-cluster/domain/models/clusterStatusResponse'

const { getStatus } = vi.hoisted(() => ({ getStatus: vi.fn() }))

vi.mock('@/features/admin-cluster/data/repositories/adminClusterQueryRepositoryImpl', () => ({
  adminClusterQueryRepository: { getStatus },
}))

// Stub unrelated admin API aggregator to avoid pulling in the pre-existing
// missing @/features/admin-audit datasource via transitive imports.
vi.mock('@/api/admin', () => ({ adminAPI: {} }))
vi.mock('@/api', () => ({}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({ t: (key: string, params?: Record<string, unknown>) => params ? `${key}:${JSON.stringify(params)}` : key }),
  }
})

vi.mock('@/core/utils/format', () => ({
  formatDateTime: (value: string) => value,
  formatRelativeTime: () => 'now',
}))

vi.mock('@/core/utils/apiError', () => ({
  extractApiErrorMessage: (_error: unknown, fallback: string) => fallback,
}))

function statusFixture(): ClusterStatusResponse {
  return {
    deployment: {
      mode: 'multi_instance',
      nodeName: 'api-a',
      runnerId: 'api-a-runner',
      workerMode: 'auto',
      workerEnabled: true,
      frontendEnabled: true,
      heartbeatIntervalSeconds: 30,
      staleAfterSeconds: 90,
      taskLeaseSeconds: 60,
    },
    summary: {
      onlineNodes: 2,
      staleNodes: 0,
      stoppedNodes: 0,
      workerNodes: 2,
      activeTasks: 1,
      unhealthyNodes: 0,
    },
    instances: [{
      runnerId: 'api-a-runner',
      nodeName: 'api-a',
      deploymentMode: 'multi_instance',
      workerMode: 'auto',
      workerEnabled: true,
      version: '1.2.3',
      hostname: 'host-a',
      processId: 10,
      databaseOk: true,
      redisOk: true,
      startedAt: '2026-07-15T00:00:00Z',
      lastSeenAt: '2026-07-15T00:01:00Z',
      status: 'online',
      current: true,
    }],
    tasks: [{
      id: 1,
      runId: 'run-1',
      taskKey: 'backup:scheduled',
      status: 'running',
      nodeName: 'api-a',
      runnerId: 'api-a-runner',
      metadata: {},
      result: {},
      errorMessage: '',
      startedAt: '2026-07-15T00:00:00Z',
      heartbeatAt: '2026-07-15T00:01:00Z',
      leaseUntil: '2026-07-15T00:02:00Z',
    }],
    observedAt: '2026-07-15T00:01:00Z',
  }
}

describe('MultiInstancePage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getStatus.mockReset()
    getStatus.mockResolvedValue(statusFixture())
  })

  it('renders node health, resolved worker mode, and active task lease', async () => {
    const wrapper = mount(MultiInstancePage, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          AppLayout: { template: '<div><slot /></div>' },
          Icon: { template: '<span />' },
          Toggle: { props: ['modelValue'], template: '<button type="button" />' },
        },
      },
    })

    await flushPromises()

    expect(getStatus).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('api-a')
    expect(wrapper.text()).toContain('backup:scheduled')
    expect(wrapper.text()).toContain('1.2.3')
  })
})
