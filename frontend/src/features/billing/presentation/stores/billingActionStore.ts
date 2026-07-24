import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { BillingActionRepository } from '@/features/billing/domain/repositories/billingActionRepository'
import { billingActionRepository as defaultRepo } from '@/features/billing/data/repositories/billingActionRepositoryImpl'

export function createBillingActionStore(repo: BillingActionRepository = defaultRepo) {
  return defineStore('billing/action', () => {
    const loading = reactive<Record<string, boolean>>({
      redeem: false,
      cancelOrder: false,
      requestRefund: false,
      verifyOrder: false,
      verifyOrderPublic: false,
      resolveOrderPublicByResumeToken: false,
    })
    const errors = reactive<Record<string, unknown>>({
      redeem: null as unknown,
      cancelOrder: null as unknown,
      requestRefund: null as unknown,
      verifyOrder: null as unknown,
      verifyOrderPublic: null as unknown,
      resolveOrderPublicByResumeToken: null as unknown,
    })

    const redeem: BillingActionRepository['redeem'] = async (...args) => {
      loading.redeem = true
      errors.redeem = null
      try {
        return await repo.redeem(...args)
      } catch (e: unknown) { errors.redeem = e; throw e }
      finally { loading.redeem = false }
    }

    const cancelOrder: BillingActionRepository['cancelOrder'] = async (...args) => {
      loading.cancelOrder = true
      errors.cancelOrder = null
      try {
        return await repo.cancelOrder(...args)
      } catch (e: unknown) { errors.cancelOrder = e; throw e }
      finally { loading.cancelOrder = false }
    }

    const requestRefund: BillingActionRepository['requestRefund'] = async (...args) => {
      loading.requestRefund = true
      errors.requestRefund = null
      try {
        return await repo.requestRefund(...args)
      } catch (e: unknown) { errors.requestRefund = e; throw e }
      finally { loading.requestRefund = false }
    }

    const verifyOrder: BillingActionRepository['verifyOrder'] = async (...args) => {
      loading.verifyOrder = true
      errors.verifyOrder = null
      try {
        return await repo.verifyOrder(...args)
      } catch (e: unknown) { errors.verifyOrder = e; throw e }
      finally { loading.verifyOrder = false }
    }

    const verifyOrderPublic: BillingActionRepository['verifyOrderPublic'] = async (...args) => {
      loading.verifyOrderPublic = true
      errors.verifyOrderPublic = null
      try {
        return await repo.verifyOrderPublic(...args)
      } catch (e: unknown) { errors.verifyOrderPublic = e; throw e }
      finally { loading.verifyOrderPublic = false }
    }

    const resolveOrderPublicByResumeToken: BillingActionRepository['resolveOrderPublicByResumeToken'] = async (...args) => {
      loading.resolveOrderPublicByResumeToken = true
      errors.resolveOrderPublicByResumeToken = null
      try {
        return await repo.resolveOrderPublicByResumeToken(...args)
      } catch (e: unknown) { errors.resolveOrderPublicByResumeToken = e; throw e }
      finally { loading.resolveOrderPublicByResumeToken = false }
    }

    return {
      loading,
      errors,
      redeem,
      cancelOrder,
      requestRefund,
      verifyOrder,
      verifyOrderPublic,
      resolveOrderPublicByResumeToken,
    }
  })
}

export const useBillingActionStore = createBillingActionStore()
