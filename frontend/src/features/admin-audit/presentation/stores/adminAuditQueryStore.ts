/**
 * AdminAuditQueryStore — per spec §7 (factory + default defineStore).
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminAuditQueryRepository } from '@/features/admin-audit/domain/repositories/adminAuditQueryRepository'
import { adminAuditQueryRepository as defaultRepo } from '@/features/admin-audit/data/repositories/adminAuditQueryRepositoryImpl'

export function createAdminAuditQueryStore(repo: AdminAuditQueryRepository = defaultRepo) {
  return defineStore('adminAudit/query', () => {
    const loading = reactive<Record<string, boolean>>({ list: false, getById: false })
    const errors = reactive<Record<string, unknown>>({ list: null, getById: null })

    const list: AdminAuditQueryRepository['list'] = async (query, options) => {
      loading.list = true
      errors.list = null
      try {
        return await repo.list(query, options)
      } catch (e) {
        errors.list = e
        throw e
      } finally {
        loading.list = false
      }
    }

    const getById: AdminAuditQueryRepository['getById'] = async (id) => {
      loading.getById = true
      errors.getById = null
      try {
        return await repo.getById(id)
      } catch (e) {
        errors.getById = e
        throw e
      } finally {
        loading.getById = false
      }
    }

    return { loading, errors, list, getById }
  })
}

export const useAdminAuditQueryStore = createAdminAuditQueryStore()
