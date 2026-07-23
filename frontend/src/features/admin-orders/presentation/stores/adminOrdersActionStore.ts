import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { adminOrdersActionRepository } from '@/features/admin-orders/data/repositories/adminOrdersActionRepositoryImpl'
import type { AdminOrdersActionRepository } from '@/features/admin-orders/domain/repositories/adminOrdersActionRepository'
import type { UpdatePaymentConfigRequest } from '@/features/admin-orders/data/requests_models/updatePaymentConfigRequest'
import type { RefundOrderRequest } from '@/features/admin-orders/data/requests_models/refundOrderRequest'
import type { CreateSubscriptionPlanRequest } from '@/features/admin-orders/data/requests_models/createSubscriptionPlanRequest'
import type { UpdateSubscriptionPlanRequest } from '@/features/admin-orders/data/requests_models/updateSubscriptionPlanRequest'
import type { CreateProviderInstanceRequest } from '@/features/admin-orders/data/requests_models/createProviderInstanceRequest'
import type { UpdateProviderInstanceRequest } from '@/features/admin-orders/data/requests_models/updateProviderInstanceRequest'

export function createAdminOrdersActionStore(repo: AdminOrdersActionRepository = adminOrdersActionRepository) {
  return defineStore('admin-orders/action', () => {
    const loading = reactive<Record<string, boolean>>({})
    const errors = reactive<Record<string, unknown>>({})

    async function run<T>(task: string, fn: () => Promise<T>): Promise<T> {
      loading[task] = true
      errors[task] = null
      try {
        return await fn()
      } catch (e) {
        errors[task] = e
        throw e
      } finally {
        loading[task] = false
      }
    }

    const updateConfig = (req: UpdatePaymentConfigRequest) =>
      run('updateConfig', () => repo.updateConfig(req))

    const cancelOrder = (id: number) =>
      run('cancelOrder', () => repo.cancelOrder(id))

    const retryRecharge = (id: number) =>
      run('retryRecharge', () => repo.retryRecharge(id))

    const refundOrder = (id: number, req: RefundOrderRequest) =>
      run('refundOrder', () => repo.refundOrder(id, req))

    const queryRefund = (id: number) =>
      run('queryRefund', () => repo.queryRefund(id))

    const createPlan = (req: CreateSubscriptionPlanRequest) =>
      run('createPlan', () => repo.createPlan(req))

    const updatePlan = (id: number, req: UpdateSubscriptionPlanRequest) =>
      run('updatePlan', () => repo.updatePlan(id, req))

    const deletePlan = (id: number) =>
      run('deletePlan', () => repo.deletePlan(id))

    const createProvider = (req: CreateProviderInstanceRequest) =>
      run('createProvider', () => repo.createProvider(req))

    const updateProvider = (id: number, req: UpdateProviderInstanceRequest) =>
      run('updateProvider', () => repo.updateProvider(id, req))

    const deleteProvider = (id: number) =>
      run('deleteProvider', () => repo.deleteProvider(id))

    return {
      loading, errors,
      updateConfig, cancelOrder, retryRecharge, refundOrder, queryRefund,
      createPlan, updatePlan, deletePlan,
      createProvider, updateProvider, deleteProvider,
    }
  })
}

export const useAdminOrdersActionStore = createAdminOrdersActionStore()
