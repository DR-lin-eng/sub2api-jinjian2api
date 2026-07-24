import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { SubscriptionsQueryRepository } from '@/features/subscriptions/domain/repositories/subscriptionsQueryRepository'
import { subscriptionsQueryRepository as defaultRepo } from '@/features/subscriptions/data/repositories/subscriptionsQueryRepositoryImpl'
import type { UserSubscription } from '@/core/models/domain/userSubscription'
import type { SubscriptionProgress } from '@/features/admin-subscriptions/domain/models/subscriptionProgress'
import type { SubscriptionSummary } from '@/features/subscriptions/domain/models/subscriptionSummary'

export function createSubscriptionsQueryStore(repo: SubscriptionsQueryRepository = defaultRepo) {
  return defineStore('subscriptions/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false,
      listActive: false,
      listProgress: false,
      getSummary: false,
      getProgress: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null,
      listActive: null,
      listProgress: null,
      getSummary: null,
      getProgress: null,
    })

    const subscriptions = ref<UserSubscription[]>([])
    const activeSubscriptions = ref<UserSubscription[]>([])
    const progress = ref<SubscriptionProgress[]>([])
    const summary = ref<SubscriptionSummary | null>(null)

    async function list(): Promise<UserSubscription[]> {
      loading.list = true
      errors.list = null
      try {
        subscriptions.value = await repo.list()
        return subscriptions.value
      } catch (error: unknown) {
        errors.list = error
        throw error
      } finally {
        loading.list = false
      }
    }

    async function listActive(): Promise<UserSubscription[]> {
      loading.listActive = true
      errors.listActive = null
      try {
        activeSubscriptions.value = await repo.listActive()
        return activeSubscriptions.value
      } catch (error: unknown) {
        errors.listActive = error
        throw error
      } finally {
        loading.listActive = false
      }
    }

    async function listProgress(): Promise<SubscriptionProgress[]> {
      loading.listProgress = true
      errors.listProgress = null
      try {
        progress.value = await repo.listProgress()
        return progress.value
      } catch (error: unknown) {
        errors.listProgress = error
        throw error
      } finally {
        loading.listProgress = false
      }
    }

    async function getSummary(): Promise<SubscriptionSummary> {
      loading.getSummary = true
      errors.getSummary = null
      try {
        summary.value = await repo.getSummary()
        return summary.value
      } catch (error: unknown) {
        errors.getSummary = error
        throw error
      } finally {
        loading.getSummary = false
      }
    }

    async function getProgress(subscriptionId: number): Promise<SubscriptionProgress> {
      loading.getProgress = true
      errors.getProgress = null
      try {
        return await repo.getProgress(subscriptionId)
      } catch (error: unknown) {
        errors.getProgress = error
        throw error
      } finally {
        loading.getProgress = false
      }
    }

    return {
      loading,
      errors,
      subscriptions,
      activeSubscriptions,
      progress,
      summary,
      list,
      listActive,
      listProgress,
      getSummary,
      getProgress,
    }
  })
}

export const useSubscriptionsQueryStore = createSubscriptionsQueryStore()
