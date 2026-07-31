import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AdminPaymentPlansView from '@/features/admin-orders/presentation/pages/AdminPaymentPlansPage.vue'

const { fetchPlans, fetchConfig } = vi.hoisted(() => ({
  fetchPlans: vi.fn(),
  fetchConfig: vi.fn(),
}))

vi.mock('@/features/admin-orders/presentation/stores/adminOrdersQueryStore', () => ({
  createAdminOrdersQueryStore: () => () => ({
    fetchPlans,
    fetchConfig,
    fetchDashboard: vi.fn(),
    fetchOrders: vi.fn(),
    fetchOrder: vi.fn(),
    fetchProviders: vi.fn(),
    loading: {},
    errors: {},
    config: null,
    dashboard: null,
    orders: null,
    plans: [],
    providers: [],
  }),
  useAdminOrdersQueryStore: () => ({
    fetchPlans,
    fetchConfig,
    fetchDashboard: vi.fn(),
    fetchOrders: vi.fn(),
    fetchOrder: vi.fn(),
    fetchProviders: vi.fn(),
    loading: {},
    errors: {},
    config: null,
    dashboard: null,
    orders: null,
    plans: [],
    providers: [],
  }),
}))

vi.mock('@/features/admin-orders/presentation/stores/adminOrdersActionStore', () => ({
  createAdminOrdersActionStore: () => () => ({ loading: {}, errors: {}, updatePlan: vi.fn(), deletePlan: vi.fn() }),
  useAdminOrdersActionStore: () => ({ loading: {}, errors: {}, updatePlan: vi.fn(), deletePlan: vi.fn() }),
}))

vi.mock('@/features/admin-groups/presentation/composables/useAdminGroups', () => ({
  useAdminGroups: () => ({ getAll: vi.fn().mockResolvedValue([]) }),
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

const DataTableStub = {
  props: ['data'],
  template: `
    <div>
      <div v-for="row in data" :key="row.id">
        <slot name="cell-price" :value="row.price" :row="row" />
      </div>
    </div>
  `,
}

describe('AdminPaymentPlansView', () => {
  beforeEach(() => {
    fetchConfig.mockResolvedValue(null)
    fetchPlans.mockResolvedValue([
      {
        id: 1, name: 'CNY plan', groupId: 1,
        price: 499, originalPrice: 599, currency: 'CNY',
        validityDays: 30, validityUnit: 'day', sortOrder: 0, forSale: true, features: [],
        groupPlatform: '', groupName: '', rateMultiplier: 1, peakRateEnabled: false,
        peakStart: '', peakEnd: '', peakRateMultiplier: 1,
        dailyLimitUsd: null, weeklyLimitUsd: null, monthlyLimitUsd: null, supportedModelScopes: [],
        description: '',
      },
      {
        id: 2, name: 'Legacy plan', groupId: 1,
        price: 10, originalPrice: 0, currency: '',
        validityDays: 30, validityUnit: 'day', sortOrder: 0, forSale: true, features: [],
        groupPlatform: '', groupName: '', rateMultiplier: 1, peakRateEnabled: false,
        peakStart: '', peakEnd: '', peakRateMultiplier: 1,
        dailyLimitUsd: null, weeklyLimitUsd: null, monthlyLimitUsd: null, supportedModelScopes: [],
        description: '',
      },
    ])
  })

  it('uses the configured currency symbol and keeps legacy prices in USD', async () => {
    const wrapper = mount(AdminPaymentPlansView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          AppLayout: { template: '<div><slot /></div>' },
          DataTable: DataTableStub,
          ConfirmDialog: true,
          GroupBadge: true,
          Icon: true,
          PlanEditDialog: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('¥499.00CNY')
    expect(wrapper.text()).toContain('¥599.00')
    expect(wrapper.text()).toContain('$10.00')
  })
})
