import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AffiliateQueryRepository } from '@/features/affiliate/domain/repositories/affiliateQueryRepository'
import { affiliateQueryRepository as defaultRepo } from '@/features/affiliate/data/repositories/affiliateQueryRepositoryImpl'

export function createAffiliateQueryStore(repo: AffiliateQueryRepository = defaultRepo) {
  return defineStore('affiliate/query', () => {
    const loading = reactive<Record<string, boolean>>({
      listUsers: false,
      listInviteRecords: false,
      listRebateRecords: false,
      listTransferRecords: false,
      getUserOverview: false,
    })
    const errors = reactive<Record<string, unknown>>({
      listUsers: null,
      listInviteRecords: null,
      listRebateRecords: null,
      listTransferRecords: null,
      getUserOverview: null,
    })

    const listUsers: AffiliateQueryRepository['listUsers'] = async (...args) => {
      loading.listUsers = true
      errors.listUsers = null
      try {
        return await repo.listUsers(...args)
      } catch (e) {
        errors.listUsers = e
        throw e
      } finally {
        loading.listUsers = false
      }
    }

    const listInviteRecords: AffiliateQueryRepository['listInviteRecords'] = async (...args) => {
      loading.listInviteRecords = true
      errors.listInviteRecords = null
      try {
        return await repo.listInviteRecords(...args)
      } catch (e) {
        errors.listInviteRecords = e
        throw e
      } finally {
        loading.listInviteRecords = false
      }
    }

    const listRebateRecords: AffiliateQueryRepository['listRebateRecords'] = async (...args) => {
      loading.listRebateRecords = true
      errors.listRebateRecords = null
      try {
        return await repo.listRebateRecords(...args)
      } catch (e) {
        errors.listRebateRecords = e
        throw e
      } finally {
        loading.listRebateRecords = false
      }
    }

    const listTransferRecords: AffiliateQueryRepository['listTransferRecords'] = async (...args) => {
      loading.listTransferRecords = true
      errors.listTransferRecords = null
      try {
        return await repo.listTransferRecords(...args)
      } catch (e) {
        errors.listTransferRecords = e
        throw e
      } finally {
        loading.listTransferRecords = false
      }
    }

    const getUserOverview: AffiliateQueryRepository['getUserOverview'] = async (...args) => {
      loading.getUserOverview = true
      errors.getUserOverview = null
      try {
        return await repo.getUserOverview(...args)
      } catch (e) {
        errors.getUserOverview = e
        throw e
      } finally {
        loading.getUserOverview = false
      }
    }

    return { loading, errors, listUsers, listInviteRecords, listRebateRecords, listTransferRecords, getUserOverview }
  })
}

export const useAffiliateQueryStore = createAffiliateQueryStore()
