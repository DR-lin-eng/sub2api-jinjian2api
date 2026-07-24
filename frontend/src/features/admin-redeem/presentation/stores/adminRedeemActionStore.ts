import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminRedeemActionRepository } from '@/features/admin-redeem/domain/repositories/adminRedeemActionRepository'
import { adminRedeemActionRepository } from '@/features/admin-redeem/data/repositories/adminRedeemActionRepositoryImpl'

export function createAdminRedeemActionStore(repo: AdminRedeemActionRepository = adminRedeemActionRepository) {
  return defineStore('adminRedeem/action', () => {
    const loading = reactive<Record<string, boolean>>({ generate: false, deleteCode: false, batchDelete: false, batchUpdate: false, expire: false })
    const errors = reactive<Record<string, unknown>>({ generate: null, deleteCode: null, batchDelete: null, batchUpdate: null, expire: null })

    const generate: AdminRedeemActionRepository['generate'] = async (...args) => {
      loading.generate = true
      errors.generate = null
      try {
        return await repo.generate(...args)
      } catch (e) {
        errors.generate = e
        throw e
      } finally {
        loading.generate = false
      }
    }

    const deleteCode: AdminRedeemActionRepository['deleteCode'] = async (...args) => {
      loading.deleteCode = true
      errors.deleteCode = null
      try {
        return await repo.deleteCode(...args)
      } catch (e) {
        errors.deleteCode = e
        throw e
      } finally {
        loading.deleteCode = false
      }
    }

    const batchDelete: AdminRedeemActionRepository['batchDelete'] = async (...args) => {
      loading.batchDelete = true
      errors.batchDelete = null
      try {
        return await repo.batchDelete(...args)
      } catch (e) {
        errors.batchDelete = e
        throw e
      } finally {
        loading.batchDelete = false
      }
    }

    const batchUpdate: AdminRedeemActionRepository['batchUpdate'] = async (...args) => {
      loading.batchUpdate = true
      errors.batchUpdate = null
      try {
        return await repo.batchUpdate(...args)
      } catch (e) {
        errors.batchUpdate = e
        throw e
      } finally {
        loading.batchUpdate = false
      }
    }

    const expire: AdminRedeemActionRepository['expire'] = async (...args) => {
      loading.expire = true
      errors.expire = null
      try {
        return await repo.expire(...args)
      } catch (e) {
        errors.expire = e
        throw e
      } finally {
        loading.expire = false
      }
    }

    return { loading, errors, generate, deleteCode, batchDelete, batchUpdate, expire }
  })
}

export const useAdminRedeemActionStore = createAdminRedeemActionStore()
