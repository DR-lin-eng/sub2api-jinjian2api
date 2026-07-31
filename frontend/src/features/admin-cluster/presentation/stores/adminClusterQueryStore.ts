/**
 * AdminClusterQueryStore — per spec §5.4 R5.1 (factory + default defineStore).
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminClusterQueryRepository } from '@/features/admin-cluster/domain/repositories/adminClusterQueryRepository'
import type { ClusterStatusResponse } from '@/features/admin-cluster/domain/models/clusterStatusResponse'
import { adminClusterQueryRepository as defaultRepo } from '@/features/admin-cluster/data/repositories/adminClusterQueryRepositoryImpl'

export function createAdminClusterQueryStore(repo: AdminClusterQueryRepository = defaultRepo) {
  return defineStore('adminCluster/query', () => {
    const loading = reactive<Record<string, boolean>>({ getStatus: false })
    const errors = reactive<Record<string, unknown>>({ getStatus: null })

    async function getStatus(options?: { signal?: AbortSignal }): Promise<ClusterStatusResponse> {
      loading.getStatus = true
      errors.getStatus = null
      try {
        return await repo.getStatus(options)
      } catch (e) {
        errors.getStatus = e
        throw e
      } finally {
        loading.getStatus = false
      }
    }

    return { loading, errors, getStatus }
  })
}

export const useAdminClusterQueryStore = createAdminClusterQueryStore()
