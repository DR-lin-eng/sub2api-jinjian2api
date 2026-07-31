import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AffiliateActionRepository } from '@/features/affiliate/domain/repositories/affiliateActionRepository'
import { affiliateActionRepository as defaultRepo } from '@/features/affiliate/data/repositories/affiliateActionRepositoryImpl'

export function createAffiliateActionStore(repo: AffiliateActionRepository = defaultRepo) {
  return defineStore('affiliate/action', () => {
    const loading = reactive<Record<string, boolean>>({
      lookupUsers: false,
      updateUserSettings: false,
      clearUserSettings: false,
      batchSetRate: false,
    })
    const errors = reactive<Record<string, unknown>>({
      lookupUsers: null,
      updateUserSettings: null,
      clearUserSettings: null,
      batchSetRate: null,
    })

    const lookupUsers: AffiliateActionRepository['lookupUsers'] = async (...args) => {
      loading.lookupUsers = true
      errors.lookupUsers = null
      try {
        return await repo.lookupUsers(...args)
      } catch (e) {
        errors.lookupUsers = e
        throw e
      } finally {
        loading.lookupUsers = false
      }
    }

    const updateUserSettings: AffiliateActionRepository['updateUserSettings'] = async (...args) => {
      loading.updateUserSettings = true
      errors.updateUserSettings = null
      try {
        return await repo.updateUserSettings(...args)
      } catch (e) {
        errors.updateUserSettings = e
        throw e
      } finally {
        loading.updateUserSettings = false
      }
    }

    const clearUserSettings: AffiliateActionRepository['clearUserSettings'] = async (...args) => {
      loading.clearUserSettings = true
      errors.clearUserSettings = null
      try {
        return await repo.clearUserSettings(...args)
      } catch (e) {
        errors.clearUserSettings = e
        throw e
      } finally {
        loading.clearUserSettings = false
      }
    }

    const batchSetRate: AffiliateActionRepository['batchSetRate'] = async (...args) => {
      loading.batchSetRate = true
      errors.batchSetRate = null
      try {
        return await repo.batchSetRate(...args)
      } catch (e) {
        errors.batchSetRate = e
        throw e
      } finally {
        loading.batchSetRate = false
      }
    }

    return { loading, errors, lookupUsers, updateUserSettings, clearUserSettings, batchSetRate }
  })
}

export const useAffiliateActionStore = createAffiliateActionStore()
