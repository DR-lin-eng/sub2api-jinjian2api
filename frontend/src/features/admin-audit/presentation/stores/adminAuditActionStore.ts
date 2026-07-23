/**
 * AdminAuditActionStore — per spec §7 (factory + default defineStore).
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminAuditActionRepository } from '@/features/admin-audit/domain/repositories/adminAuditActionRepository'
import type { ClearAuditLogRequest } from '@/features/admin-audit/data/requests_models/clearAuditLogRequest'
import { adminAuditActionRepository as defaultRepo } from '@/features/admin-audit/data/repositories/adminAuditActionRepositoryImpl'

export function createAdminAuditActionStore(repo: AdminAuditActionRepository = defaultRepo) {
  return defineStore('adminAudit/action', () => {
    const loading = reactive<Record<string, boolean>>({ clear: false })
    const errors = reactive<Record<string, unknown>>({ clear: null })

    const clear = async (req: ClearAuditLogRequest): Promise<{ deleted: number }> => {
      loading.clear = true
      errors.clear = null
      try {
        return await repo.clear(req)
      } catch (e) {
        errors.clear = e
        throw e
      } finally {
        loading.clear = false
      }
    }

    return { loading, errors, clear }
  })
}

export const useAdminAuditActionStore = createAdminAuditActionStore()
