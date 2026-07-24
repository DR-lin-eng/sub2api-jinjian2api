import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminOpsActionRepository } from '@/features/admin-ops/domain/repositories/adminOpsActionRepository'
import { adminOpsActionRepository as defaultRepo } from '@/features/admin-ops/data/repositories/adminOpsActionRepositoryImpl'

export function createAdminOpsActionStore(repo: AdminOpsActionRepository = defaultRepo) {
  return defineStore('adminOps/action', () => {
    const loading = reactive<Record<string, boolean>>({
      updateErrorResolved: false,
      updateRequestErrorResolved: false,
      updateUpstreamErrorResolved: false,
      createAlertRule: false,
      updateAlertRule: false,
      deleteAlertRule: false,
      updateAlertEventStatus: false,
      createAlertSilence: false,
      updateEmailNotificationConfig: false,
      updateAlertRuntimeSettings: false,
      updateRuntimeLogConfig: false,
      resetRuntimeLogConfig: false,
      cleanupSystemLogs: false,
      updateAdvancedSettings: false,
    })
    const errors = reactive<Record<string, unknown>>({
      updateErrorResolved: null,
      updateRequestErrorResolved: null,
      updateUpstreamErrorResolved: null,
      createAlertRule: null,
      updateAlertRule: null,
      deleteAlertRule: null,
      updateAlertEventStatus: null,
      createAlertSilence: null,
      updateEmailNotificationConfig: null,
      updateAlertRuntimeSettings: null,
      updateRuntimeLogConfig: null,
      resetRuntimeLogConfig: null,
      cleanupSystemLogs: null,
      updateAdvancedSettings: null,
    })

    const updateErrorResolved: AdminOpsActionRepository['updateErrorResolved'] = ((...args: unknown[]) => {
      loading.updateErrorResolved = true
      errors.updateErrorResolved = null
      return Promise.resolve()
        .then(() => (repo.updateErrorResolved as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateErrorResolved = error; throw error })
        .finally(() => { loading.updateErrorResolved = false })
    }) as AdminOpsActionRepository['updateErrorResolved']

    const updateRequestErrorResolved: AdminOpsActionRepository['updateRequestErrorResolved'] = ((...args: unknown[]) => {
      loading.updateRequestErrorResolved = true
      errors.updateRequestErrorResolved = null
      return Promise.resolve()
        .then(() => (repo.updateRequestErrorResolved as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateRequestErrorResolved = error; throw error })
        .finally(() => { loading.updateRequestErrorResolved = false })
    }) as AdminOpsActionRepository['updateRequestErrorResolved']

    const updateUpstreamErrorResolved: AdminOpsActionRepository['updateUpstreamErrorResolved'] = ((...args: unknown[]) => {
      loading.updateUpstreamErrorResolved = true
      errors.updateUpstreamErrorResolved = null
      return Promise.resolve()
        .then(() => (repo.updateUpstreamErrorResolved as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateUpstreamErrorResolved = error; throw error })
        .finally(() => { loading.updateUpstreamErrorResolved = false })
    }) as AdminOpsActionRepository['updateUpstreamErrorResolved']

    const createAlertRule: AdminOpsActionRepository['createAlertRule'] = ((...args: unknown[]) => {
      loading.createAlertRule = true
      errors.createAlertRule = null
      return Promise.resolve()
        .then(() => (repo.createAlertRule as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.createAlertRule = error; throw error })
        .finally(() => { loading.createAlertRule = false })
    }) as AdminOpsActionRepository['createAlertRule']

    const updateAlertRule: AdminOpsActionRepository['updateAlertRule'] = ((...args: unknown[]) => {
      loading.updateAlertRule = true
      errors.updateAlertRule = null
      return Promise.resolve()
        .then(() => (repo.updateAlertRule as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateAlertRule = error; throw error })
        .finally(() => { loading.updateAlertRule = false })
    }) as AdminOpsActionRepository['updateAlertRule']

    const deleteAlertRule: AdminOpsActionRepository['deleteAlertRule'] = ((...args: unknown[]) => {
      loading.deleteAlertRule = true
      errors.deleteAlertRule = null
      return Promise.resolve()
        .then(() => (repo.deleteAlertRule as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.deleteAlertRule = error; throw error })
        .finally(() => { loading.deleteAlertRule = false })
    }) as AdminOpsActionRepository['deleteAlertRule']

    const updateAlertEventStatus: AdminOpsActionRepository['updateAlertEventStatus'] = ((...args: unknown[]) => {
      loading.updateAlertEventStatus = true
      errors.updateAlertEventStatus = null
      return Promise.resolve()
        .then(() => (repo.updateAlertEventStatus as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateAlertEventStatus = error; throw error })
        .finally(() => { loading.updateAlertEventStatus = false })
    }) as AdminOpsActionRepository['updateAlertEventStatus']

    const createAlertSilence: AdminOpsActionRepository['createAlertSilence'] = ((...args: unknown[]) => {
      loading.createAlertSilence = true
      errors.createAlertSilence = null
      return Promise.resolve()
        .then(() => (repo.createAlertSilence as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.createAlertSilence = error; throw error })
        .finally(() => { loading.createAlertSilence = false })
    }) as AdminOpsActionRepository['createAlertSilence']

    const updateEmailNotificationConfig: AdminOpsActionRepository['updateEmailNotificationConfig'] = ((...args: unknown[]) => {
      loading.updateEmailNotificationConfig = true
      errors.updateEmailNotificationConfig = null
      return Promise.resolve()
        .then(() => (repo.updateEmailNotificationConfig as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateEmailNotificationConfig = error; throw error })
        .finally(() => { loading.updateEmailNotificationConfig = false })
    }) as AdminOpsActionRepository['updateEmailNotificationConfig']

    const updateAlertRuntimeSettings: AdminOpsActionRepository['updateAlertRuntimeSettings'] = ((...args: unknown[]) => {
      loading.updateAlertRuntimeSettings = true
      errors.updateAlertRuntimeSettings = null
      return Promise.resolve()
        .then(() => (repo.updateAlertRuntimeSettings as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateAlertRuntimeSettings = error; throw error })
        .finally(() => { loading.updateAlertRuntimeSettings = false })
    }) as AdminOpsActionRepository['updateAlertRuntimeSettings']

    const updateRuntimeLogConfig: AdminOpsActionRepository['updateRuntimeLogConfig'] = ((...args: unknown[]) => {
      loading.updateRuntimeLogConfig = true
      errors.updateRuntimeLogConfig = null
      return Promise.resolve()
        .then(() => (repo.updateRuntimeLogConfig as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateRuntimeLogConfig = error; throw error })
        .finally(() => { loading.updateRuntimeLogConfig = false })
    }) as AdminOpsActionRepository['updateRuntimeLogConfig']

    const resetRuntimeLogConfig: AdminOpsActionRepository['resetRuntimeLogConfig'] = ((...args: unknown[]) => {
      loading.resetRuntimeLogConfig = true
      errors.resetRuntimeLogConfig = null
      return Promise.resolve()
        .then(() => (repo.resetRuntimeLogConfig as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.resetRuntimeLogConfig = error; throw error })
        .finally(() => { loading.resetRuntimeLogConfig = false })
    }) as AdminOpsActionRepository['resetRuntimeLogConfig']

    const cleanupSystemLogs: AdminOpsActionRepository['cleanupSystemLogs'] = ((...args: unknown[]) => {
      loading.cleanupSystemLogs = true
      errors.cleanupSystemLogs = null
      return Promise.resolve()
        .then(() => (repo.cleanupSystemLogs as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.cleanupSystemLogs = error; throw error })
        .finally(() => { loading.cleanupSystemLogs = false })
    }) as AdminOpsActionRepository['cleanupSystemLogs']

    const updateAdvancedSettings: AdminOpsActionRepository['updateAdvancedSettings'] = ((...args: unknown[]) => {
      loading.updateAdvancedSettings = true
      errors.updateAdvancedSettings = null
      return Promise.resolve()
        .then(() => (repo.updateAdvancedSettings as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.updateAdvancedSettings = error; throw error })
        .finally(() => { loading.updateAdvancedSettings = false })
    }) as AdminOpsActionRepository['updateAdvancedSettings']

    return {
      loading,
      errors,
      updateErrorResolved,
      updateRequestErrorResolved,
      updateUpstreamErrorResolved,
      createAlertRule,
      updateAlertRule,
      deleteAlertRule,
      updateAlertEventStatus,
      createAlertSilence,
      updateEmailNotificationConfig,
      updateAlertRuntimeSettings,
      updateRuntimeLogConfig,
      resetRuntimeLogConfig,
      cleanupSystemLogs,
      updateAdvancedSettings,
    }
  })
}

export const useAdminOpsActionStore = createAdminOpsActionStore()
