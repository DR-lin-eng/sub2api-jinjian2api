/**
 * AdminChannelMonitorQueryStore — factory + default defineStore per spec §7.
 * Hand-written; the .tmp_gen_stores.mjs generator skips this feature.
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminChannelMonitorQueryRepository } from '@/features/admin-channel-monitor/domain/repositories/adminChannelMonitorQueryRepository'
import { adminChannelMonitorQueryRepository as defaultRepo } from '@/features/admin-channel-monitor/data/repositories/adminChannelMonitorQueryRepositoryImpl'

export function createAdminChannelMonitorQueryStore(
  repo: AdminChannelMonitorQueryRepository = defaultRepo,
) {
  return defineStore('adminChannelMonitor/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false,
      getById: false,
      listHistory: false,
      listTemplates: false,
      getTemplateById: false,
      listAssociatedMonitors: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null,
      getById: null,
      listHistory: null,
      listTemplates: null,
      getTemplateById: null,
      listAssociatedMonitors: null,
    })

    const list: AdminChannelMonitorQueryRepository['list'] = async (params, options) => {
      loading.list = true
      errors.list = null
      try {
        return await repo.list(params, options)
      } catch (e) {
        errors.list = e
        throw e
      } finally {
        loading.list = false
      }
    }

    const getById: AdminChannelMonitorQueryRepository['getById'] = async (id) => {
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

    const listHistory: AdminChannelMonitorQueryRepository['listHistory'] = async (id, params) => {
      loading.listHistory = true
      errors.listHistory = null
      try {
        return await repo.listHistory(id, params)
      } catch (e) {
        errors.listHistory = e
        throw e
      } finally {
        loading.listHistory = false
      }
    }

    const listTemplates: AdminChannelMonitorQueryRepository['listTemplates'] = async (params) => {
      loading.listTemplates = true
      errors.listTemplates = null
      try {
        return await repo.listTemplates(params)
      } catch (e) {
        errors.listTemplates = e
        throw e
      } finally {
        loading.listTemplates = false
      }
    }

    const getTemplateById: AdminChannelMonitorQueryRepository['getTemplateById'] = async (id) => {
      loading.getTemplateById = true
      errors.getTemplateById = null
      try {
        return await repo.getTemplateById(id)
      } catch (e) {
        errors.getTemplateById = e
        throw e
      } finally {
        loading.getTemplateById = false
      }
    }

    const listAssociatedMonitors: AdminChannelMonitorQueryRepository['listAssociatedMonitors'] =
      async (id) => {
        loading.listAssociatedMonitors = true
        errors.listAssociatedMonitors = null
        try {
          return await repo.listAssociatedMonitors(id)
        } catch (e) {
          errors.listAssociatedMonitors = e
          throw e
        } finally {
          loading.listAssociatedMonitors = false
        }
      }

    return {
      loading,
      errors,
      list,
      getById,
      listHistory,
      listTemplates,
      getTemplateById,
      listAssociatedMonitors,
    }
  })
}

export const useAdminChannelMonitorQueryStore = createAdminChannelMonitorQueryStore()
