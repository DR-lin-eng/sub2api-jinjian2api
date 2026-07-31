import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { adminOrdersQueryRepository } from '@/features/admin-orders/data/repositories/adminOrdersQueryRepositoryImpl'
import type { AdminOrdersQueryRepository } from '@/features/admin-orders/domain/repositories/adminOrdersQueryRepository'
import type { AdminPaymentConfig } from '@/features/admin-orders/domain/models/adminPaymentConfig'
import type { DashboardStats } from '@/features/admin-orders/domain/models/dashboardStats'
import type { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import type { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { ProviderInstance } from '@/features/admin-orders/domain/models/providerInstance'
import type { GetOrdersRequest } from '@/features/admin-orders/data/requests_models/getOrdersRequest'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'

export function createAdminOrdersQueryStore(repo: AdminOrdersQueryRepository = adminOrdersQueryRepository) {
  return defineStore('admin-orders/query', () => {
    const loading = reactive<Record<string, boolean>>({})
    const errors = reactive<Record<string, unknown>>({})

    const config = ref<AdminPaymentConfig | null>(null)
    const dashboard = ref<DashboardStats | null>(null)
    const orders = ref<PaginatedResponse<PaymentOrder> | null>(null)
    const plans = ref<SubscriptionPlan[]>([])
    const providers = ref<ProviderInstance[]>([])

    async function fetchConfig() {
      loading['config'] = true
      errors['config'] = null
      try {
        config.value = await repo.getConfig()
        return config.value
      } catch (e) {
        errors['config'] = e
        throw e
      } finally {
        loading['config'] = false
      }
    }

    async function fetchDashboard(days?: number) {
      loading['dashboard'] = true
      errors['dashboard'] = null
      try {
        dashboard.value = await repo.getDashboard(days)
        return dashboard.value
      } catch (e) {
        errors['dashboard'] = e
        throw e
      } finally {
        loading['dashboard'] = false
      }
    }

    async function fetchOrders(req?: GetOrdersRequest) {
      loading['orders'] = true
      errors['orders'] = null
      try {
        orders.value = await repo.getOrders(req)
        return orders.value
      } catch (e) {
        errors['orders'] = e
        throw e
      } finally {
        loading['orders'] = false
      }
    }

    async function fetchOrder(id: number) {
      loading['order'] = true
      errors['order'] = null
      try {
        return await repo.getOrder(id)
      } catch (e) {
        errors['order'] = e
        throw e
      } finally {
        loading['order'] = false
      }
    }

    async function fetchPlans() {
      loading['plans'] = true
      errors['plans'] = null
      try {
        plans.value = await repo.getPlans()
        return plans.value
      } catch (e) {
        errors['plans'] = e
        throw e
      } finally {
        loading['plans'] = false
      }
    }

    async function fetchProviders() {
      loading['providers'] = true
      errors['providers'] = null
      try {
        providers.value = await repo.getProviders()
        return providers.value
      } catch (e) {
        errors['providers'] = e
        throw e
      } finally {
        loading['providers'] = false
      }
    }

    return { loading, errors, config, dashboard, orders, plans, providers, fetchConfig, fetchDashboard, fetchOrders, fetchOrder, fetchPlans, fetchProviders }
  })
}

export const useAdminOrdersQueryStore = createAdminOrdersQueryStore()
