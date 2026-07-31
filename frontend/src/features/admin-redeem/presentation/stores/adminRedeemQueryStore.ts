import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminRedeemQueryRepository } from '@/features/admin-redeem/domain/repositories/adminRedeemQueryRepository'
import { adminRedeemQueryRepository } from '@/features/admin-redeem/data/repositories/adminRedeemQueryRepositoryImpl'

export function createAdminRedeemQueryStore(repo: AdminRedeemQueryRepository = adminRedeemQueryRepository) {
  return defineStore('adminRedeem/query', () => {
    const loading = reactive<Record<string, boolean>>({ list: false, getById: false, getStats: false, exportCodes: false })
    const errors = reactive<Record<string, unknown>>({ list: null, getById: null, getStats: null, exportCodes: null })

    const list: AdminRedeemQueryRepository['list'] = async (...args) => {
      loading.list = true
      errors.list = null
      try {
        return await repo.list(...args)
      } catch (e) {
        errors.list = e
        throw e
      } finally {
        loading.list = false
      }
    }

    const getById: AdminRedeemQueryRepository['getById'] = async (...args) => {
      loading.getById = true
      errors.getById = null
      try {
        return await repo.getById(...args)
      } catch (e) {
        errors.getById = e
        throw e
      } finally {
        loading.getById = false
      }
    }

    const getStats: AdminRedeemQueryRepository['getStats'] = async () => {
      loading.getStats = true
      errors.getStats = null
      try {
        return await repo.getStats()
      } catch (e) {
        errors.getStats = e
        throw e
      } finally {
        loading.getStats = false
      }
    }

    const exportCodes: AdminRedeemQueryRepository['exportCodes'] = async (...args) => {
      loading.exportCodes = true
      errors.exportCodes = null
      try {
        return await repo.exportCodes(...args)
      } catch (e) {
        errors.exportCodes = e
        throw e
      } finally {
        loading.exportCodes = false
      }
    }

    return { loading, errors, list, getById, getStats, exportCodes }
  })
}

export const useAdminRedeemQueryStore = createAdminRedeemQueryStore()
