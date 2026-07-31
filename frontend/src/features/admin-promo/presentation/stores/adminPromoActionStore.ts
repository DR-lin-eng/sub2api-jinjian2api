import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminPromoActionRepository } from '@/features/admin-promo/domain/repositories/adminPromoActionRepository'
import { adminPromoActionRepository as defaultRepo } from '@/features/admin-promo/data/repositories/adminPromoActionRepositoryImpl'

export function createAdminPromoActionStore(repo: AdminPromoActionRepository = defaultRepo) {
  return defineStore('adminPromo/action', () => {
    const loading = reactive<Record<string, boolean>>({ create: false, update: false, deleteCode: false })
    const errors = reactive<Record<string, unknown>>({ create: null, update: null, deleteCode: null })

    const create: AdminPromoActionRepository['create'] = async (...args) => {
      loading.create = true
      errors.create = null
      try {
        return await repo.create(...args)
      } catch (error: unknown) {
        errors.create = error
        throw error
      } finally {
        loading.create = false
      }
    }

    const update: AdminPromoActionRepository['update'] = async (...args) => {
      loading.update = true
      errors.update = null
      try {
        return await repo.update(...args)
      } catch (error: unknown) {
        errors.update = error
        throw error
      } finally {
        loading.update = false
      }
    }

    const deleteCode: AdminPromoActionRepository['deleteCode'] = async (...args) => {
      loading.deleteCode = true
      errors.deleteCode = null
      try {
        return await repo.deleteCode(...args)
      } catch (error: unknown) {
        errors.deleteCode = error
        throw error
      } finally {
        loading.deleteCode = false
      }
    }

    return { loading, errors, create, update, deleteCode }
  })
}

export const useAdminPromoActionStore = createAdminPromoActionStore()
