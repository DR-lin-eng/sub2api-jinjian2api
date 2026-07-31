import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminPromoQueryRepository } from '@/features/admin-promo/domain/repositories/adminPromoQueryRepository'
import { adminPromoQueryRepository as defaultRepo } from '@/features/admin-promo/data/repositories/adminPromoQueryRepositoryImpl'

export function createAdminPromoQueryStore(repo: AdminPromoQueryRepository = defaultRepo) {
  return defineStore('adminPromo/query', () => {
    const loading = reactive<Record<string, boolean>>({ list: false, getById: false, getUsages: false })
    const errors = reactive<Record<string, unknown>>({ list: null, getById: null, getUsages: null })

    const list: AdminPromoQueryRepository['list'] = async (...args) => {
      loading.list = true
      errors.list = null
      try {
        return await repo.list(...args)
      } catch (error: unknown) {
        errors.list = error
        throw error
      } finally {
        loading.list = false
      }
    }

    const getById: AdminPromoQueryRepository['getById'] = async (...args) => {
      loading.getById = true
      errors.getById = null
      try {
        return await repo.getById(...args)
      } catch (error: unknown) {
        errors.getById = error
        throw error
      } finally {
        loading.getById = false
      }
    }

    const getUsages: AdminPromoQueryRepository['getUsages'] = async (...args) => {
      loading.getUsages = true
      errors.getUsages = null
      try {
        return await repo.getUsages(...args)
      } catch (error: unknown) {
        errors.getUsages = error
        throw error
      } finally {
        loading.getUsages = false
      }
    }

    return { loading, errors, list, getById, getUsages }
  })
}

export const useAdminPromoQueryStore = createAdminPromoQueryStore()
