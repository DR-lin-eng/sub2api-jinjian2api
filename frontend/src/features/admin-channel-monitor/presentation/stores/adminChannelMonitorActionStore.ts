/**
 * AdminChannelMonitorActionStore — factory + default defineStore per spec §7.
 * Hand-written; the .tmp_gen_stores.mjs generator skips this feature.
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminChannelMonitorActionRepository } from '@/features/admin-channel-monitor/domain/repositories/adminChannelMonitorActionRepository'
import { adminChannelMonitorActionRepository as defaultRepo } from '@/features/admin-channel-monitor/data/repositories/adminChannelMonitorActionRepositoryImpl'

export function createAdminChannelMonitorActionStore(
  repo: AdminChannelMonitorActionRepository = defaultRepo,
) {
  return defineStore('adminChannelMonitor/action', () => {
    const loading = reactive<Record<string, boolean>>({
      create: false,
      update: false,
      deleteMonitor: false,
      runNow: false,
      duplicate: false,
      createTemplate: false,
      updateTemplate: false,
      deleteTemplate: false,
      applyTemplate: false,
    })
    const errors = reactive<Record<string, unknown>>({
      create: null,
      update: null,
      deleteMonitor: null,
      runNow: null,
      duplicate: null,
      createTemplate: null,
      updateTemplate: null,
      deleteTemplate: null,
      applyTemplate: null,
    })

    const create: AdminChannelMonitorActionRepository['create'] = async (payload) => {
      loading.create = true
      errors.create = null
      try {
        return await repo.create(payload)
      } catch (e) {
        errors.create = e
        throw e
      } finally {
        loading.create = false
      }
    }

    const update: AdminChannelMonitorActionRepository['update'] = async (id, payload) => {
      loading.update = true
      errors.update = null
      try {
        return await repo.update(id, payload)
      } catch (e) {
        errors.update = e
        throw e
      } finally {
        loading.update = false
      }
    }

    const deleteMonitor: AdminChannelMonitorActionRepository['deleteMonitor'] = async (id) => {
      loading.deleteMonitor = true
      errors.deleteMonitor = null
      try {
        return await repo.deleteMonitor(id)
      } catch (e) {
        errors.deleteMonitor = e
        throw e
      } finally {
        loading.deleteMonitor = false
      }
    }

    const runNow: AdminChannelMonitorActionRepository['runNow'] = async (id) => {
      loading.runNow = true
      errors.runNow = null
      try {
        return await repo.runNow(id)
      } catch (e) {
        errors.runNow = e
        throw e
      } finally {
        loading.runNow = false
      }
    }

    const duplicate: AdminChannelMonitorActionRepository['duplicate'] = async (id) => {
      loading.duplicate = true
      errors.duplicate = null
      try {
        return await repo.duplicate(id)
      } catch (e) {
        errors.duplicate = e
        throw e
      } finally {
        loading.duplicate = false
      }
    }

    const createTemplate: AdminChannelMonitorActionRepository['createTemplate'] = async (payload) => {
      loading.createTemplate = true
      errors.createTemplate = null
      try {
        return await repo.createTemplate(payload)
      } catch (e) {
        errors.createTemplate = e
        throw e
      } finally {
        loading.createTemplate = false
      }
    }

    const updateTemplate: AdminChannelMonitorActionRepository['updateTemplate'] = async (id, payload) => {
      loading.updateTemplate = true
      errors.updateTemplate = null
      try {
        return await repo.updateTemplate(id, payload)
      } catch (e) {
        errors.updateTemplate = e
        throw e
      } finally {
        loading.updateTemplate = false
      }
    }

    const deleteTemplate: AdminChannelMonitorActionRepository['deleteTemplate'] = async (id) => {
      loading.deleteTemplate = true
      errors.deleteTemplate = null
      try {
        return await repo.deleteTemplate(id)
      } catch (e) {
        errors.deleteTemplate = e
        throw e
      } finally {
        loading.deleteTemplate = false
      }
    }

    const applyTemplate: AdminChannelMonitorActionRepository['applyTemplate'] = async (id, monitorIds) => {
      loading.applyTemplate = true
      errors.applyTemplate = null
      try {
        return await repo.applyTemplate(id, monitorIds)
      } catch (e) {
        errors.applyTemplate = e
        throw e
      } finally {
        loading.applyTemplate = false
      }
    }

    return {
      loading,
      errors,
      create,
      update,
      deleteMonitor,
      runNow,
      duplicate,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      applyTemplate,
    }
  })
}

export const useAdminChannelMonitorActionStore = createAdminChannelMonitorActionStore()
