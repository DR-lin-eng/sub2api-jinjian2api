import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { BillingQueryRepository } from '@/features/billing/domain/repositories/billingQueryRepository'
import { billingQueryRepository as defaultRepo } from '@/features/billing/data/repositories/billingQueryRepositoryImpl'

export function createBillingQueryStore(repo: BillingQueryRepository = defaultRepo) {
  return defineStore('billing/query', () => {
    const loading = reactive<Record<string, boolean>>({
      getHistory: false,
      getCheckoutInfo: false,
      getMyOrders: false,
      getOrder: false,
      getRefundEligibleProviders: false,
    })
    const errors = reactive<Record<string, unknown>>({
      getHistory: null as unknown,
      getCheckoutInfo: null as unknown,
      getMyOrders: null as unknown,
      getOrder: null as unknown,
      getRefundEligibleProviders: null as unknown,
    })

    const getHistory: BillingQueryRepository['getHistory'] = async (...args) => {
      loading.getHistory = true
      errors.getHistory = null
      try {
        return await repo.getHistory(...args)
      } catch (e: unknown) { errors.getHistory = e; throw e }
      finally { loading.getHistory = false }
    }

    const getCheckoutInfo: BillingQueryRepository['getCheckoutInfo'] = async (...args) => {
      loading.getCheckoutInfo = true
      errors.getCheckoutInfo = null
      try {
        return await repo.getCheckoutInfo(...args)
      } catch (e: unknown) { errors.getCheckoutInfo = e; throw e }
      finally { loading.getCheckoutInfo = false }
    }

    const getMyOrders: BillingQueryRepository['getMyOrders'] = async (...args) => {
      loading.getMyOrders = true
      errors.getMyOrders = null
      try {
        return await repo.getMyOrders(...args)
      } catch (e: unknown) { errors.getMyOrders = e; throw e }
      finally { loading.getMyOrders = false }
    }

    const getOrder: BillingQueryRepository['getOrder'] = async (...args) => {
      loading.getOrder = true
      errors.getOrder = null
      try {
        return await repo.getOrder(...args)
      } catch (e: unknown) { errors.getOrder = e; throw e }
      finally { loading.getOrder = false }
    }

    const getRefundEligibleProviders: BillingQueryRepository['getRefundEligibleProviders'] = async (...args) => {
      loading.getRefundEligibleProviders = true
      errors.getRefundEligibleProviders = null
      try {
        return await repo.getRefundEligibleProviders(...args)
      } catch (e: unknown) { errors.getRefundEligibleProviders = e; throw e }
      finally { loading.getRefundEligibleProviders = false }
    }

    return {
      loading,
      errors,
      getHistory,
      getCheckoutInfo,
      getMyOrders,
      getOrder,
      getRefundEligibleProviders,
    }
  })
}

export const useBillingQueryStore = createBillingQueryStore()
