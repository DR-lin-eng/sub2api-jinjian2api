import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { GroupsUserQueryRepository } from '@/features/groups-user/domain/repositories/groupsUserQueryRepository'
import { groupsUserQueryRepository as defaultRepo } from '@/features/groups-user/data/repositories/groupsUserQueryRepositoryImpl'

export function createGroupsUserQueryStore(repo: GroupsUserQueryRepository = defaultRepo) {
  return defineStore('groupsUser/query', () => {
    const loading = reactive<Record<string, boolean>>({ getAvailable: false, getUserGroupRates: false })
    const errors = reactive<Record<string, unknown>>({ getAvailable: null, getUserGroupRates: null })

    async function getAvailable() {
      loading.getAvailable = true
      errors.getAvailable = null
      try {
        return await repo.getAvailable()
      } catch (error: unknown) {
        errors.getAvailable = error
        throw error
      } finally {
        loading.getAvailable = false
      }
    }

    async function getUserGroupRates() {
      loading.getUserGroupRates = true
      errors.getUserGroupRates = null
      try {
        return await repo.getUserGroupRates()
      } catch (error: unknown) {
        errors.getUserGroupRates = error
        throw error
      } finally {
        loading.getUserGroupRates = false
      }
    }

    return { loading, errors, getAvailable, getUserGroupRates }
  })
}

export const useGroupsUserQueryStore = createGroupsUserQueryStore()
