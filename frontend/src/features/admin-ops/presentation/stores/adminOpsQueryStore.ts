/**
 * AdminOpsQueryStore — rewritten to use split Query repository.
 */

import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminOpsQueryRepository } from '@/features/admin-ops/domain/repositories/adminOpsQueryRepository'
import { adminOpsQueryRepository as defaultRepo } from '@/features/admin-ops/data/repositories/adminOpsQueryRepositoryImpl'

export function createAdminOpsQueryStore(repo: AdminOpsQueryRepository = defaultRepo) {
  return defineStore('adminOps/query', () => {
    const loading = reactive<Record<string, boolean>>({
      getConcurrencyStats: false,
      getUserConcurrencyStats: false,
      getAccountAvailabilityStats: false,
      getRealtimeTrafficSummary: false,
      getDashboardOverview: false,
      getDashboardSnapshotV2: false,
      getThroughputTrend: false,
      getLatencyHistogram: false,
      getErrorTrend: false,
      getErrorDistribution: false,
      getImageGenerationStats: false,
      getOpenAITokenStats: false,
      getUserUsageStats: false,
      listErrorLogs: false,
      getErrorLogDetail: false,
      listRequestErrors: false,
      listUpstreamErrors: false,
      getRequestErrorDetail: false,
      getUpstreamErrorDetail: false,
      listRequestErrorUpstreamErrors: false,
      listRequestDetails: false,
      listAlertRules: false,
      listAlertEvents: false,
      getAlertEvent: false,
      getEmailNotificationConfig: false,
      getSettingsSnapshot: false,
      getAlertRuntimeSettings: false,
      getRuntimeLogConfig: false,
      listSystemLogs: false,
      getSystemLogSinkHealth: false,
      getAdvancedSettings: false,
    })
    const errors = reactive<Record<string, unknown>>({
      getConcurrencyStats: null,
      getUserConcurrencyStats: null,
      getAccountAvailabilityStats: null,
      getRealtimeTrafficSummary: null,
      getDashboardOverview: null,
      getDashboardSnapshotV2: null,
      getThroughputTrend: null,
      getLatencyHistogram: null,
      getErrorTrend: null,
      getErrorDistribution: null,
      getImageGenerationStats: null,
      getOpenAITokenStats: null,
      getUserUsageStats: null,
      listErrorLogs: null,
      getErrorLogDetail: null,
      listRequestErrors: null,
      listUpstreamErrors: null,
      getRequestErrorDetail: null,
      getUpstreamErrorDetail: null,
      listRequestErrorUpstreamErrors: null,
      listRequestDetails: null,
      listAlertRules: null,
      listAlertEvents: null,
      getAlertEvent: null,
      getEmailNotificationConfig: null,
      getSettingsSnapshot: null,
      getAlertRuntimeSettings: null,
      getRuntimeLogConfig: null,
      listSystemLogs: null,
      getSystemLogSinkHealth: null,
      getAdvancedSettings: null,
    })

    const getConcurrencyStats: AdminOpsQueryRepository['getConcurrencyStats'] = ((...args: unknown[]) => {
      loading.getConcurrencyStats = true
      errors.getConcurrencyStats = null
      return Promise.resolve()
        .then(() => (repo.getConcurrencyStats as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getConcurrencyStats = error; throw error })
        .finally(() => { loading.getConcurrencyStats = false })
    }) as AdminOpsQueryRepository['getConcurrencyStats']

    const getUserConcurrencyStats: AdminOpsQueryRepository['getUserConcurrencyStats'] = ((...args: unknown[]) => {
      loading.getUserConcurrencyStats = true
      errors.getUserConcurrencyStats = null
      return Promise.resolve()
        .then(() => (repo.getUserConcurrencyStats as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getUserConcurrencyStats = error; throw error })
        .finally(() => { loading.getUserConcurrencyStats = false })
    }) as AdminOpsQueryRepository['getUserConcurrencyStats']

    const getAccountAvailabilityStats: AdminOpsQueryRepository['getAccountAvailabilityStats'] = ((...args: unknown[]) => {
      loading.getAccountAvailabilityStats = true
      errors.getAccountAvailabilityStats = null
      return Promise.resolve()
        .then(() => (repo.getAccountAvailabilityStats as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getAccountAvailabilityStats = error; throw error })
        .finally(() => { loading.getAccountAvailabilityStats = false })
    }) as AdminOpsQueryRepository['getAccountAvailabilityStats']

    const getRealtimeTrafficSummary: AdminOpsQueryRepository['getRealtimeTrafficSummary'] = ((...args: unknown[]) => {
      loading.getRealtimeTrafficSummary = true
      errors.getRealtimeTrafficSummary = null
      return Promise.resolve()
        .then(() => (repo.getRealtimeTrafficSummary as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getRealtimeTrafficSummary = error; throw error })
        .finally(() => { loading.getRealtimeTrafficSummary = false })
    }) as AdminOpsQueryRepository['getRealtimeTrafficSummary']

    const getDashboardOverview: AdminOpsQueryRepository['getDashboardOverview'] = ((...args: unknown[]) => {
      loading.getDashboardOverview = true
      errors.getDashboardOverview = null
      return Promise.resolve()
        .then(() => (repo.getDashboardOverview as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getDashboardOverview = error; throw error })
        .finally(() => { loading.getDashboardOverview = false })
    }) as AdminOpsQueryRepository['getDashboardOverview']

    const getDashboardSnapshotV2: AdminOpsQueryRepository['getDashboardSnapshotV2'] = ((...args: unknown[]) => {
      loading.getDashboardSnapshotV2 = true
      errors.getDashboardSnapshotV2 = null
      return Promise.resolve()
        .then(() => (repo.getDashboardSnapshotV2 as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getDashboardSnapshotV2 = error; throw error })
        .finally(() => { loading.getDashboardSnapshotV2 = false })
    }) as AdminOpsQueryRepository['getDashboardSnapshotV2']

    const getThroughputTrend: AdminOpsQueryRepository['getThroughputTrend'] = ((...args: unknown[]) => {
      loading.getThroughputTrend = true
      errors.getThroughputTrend = null
      return Promise.resolve()
        .then(() => (repo.getThroughputTrend as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getThroughputTrend = error; throw error })
        .finally(() => { loading.getThroughputTrend = false })
    }) as AdminOpsQueryRepository['getThroughputTrend']

    const getLatencyHistogram: AdminOpsQueryRepository['getLatencyHistogram'] = ((...args: unknown[]) => {
      loading.getLatencyHistogram = true
      errors.getLatencyHistogram = null
      return Promise.resolve()
        .then(() => (repo.getLatencyHistogram as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getLatencyHistogram = error; throw error })
        .finally(() => { loading.getLatencyHistogram = false })
    }) as AdminOpsQueryRepository['getLatencyHistogram']

    const getErrorTrend: AdminOpsQueryRepository['getErrorTrend'] = ((...args: unknown[]) => {
      loading.getErrorTrend = true
      errors.getErrorTrend = null
      return Promise.resolve()
        .then(() => (repo.getErrorTrend as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getErrorTrend = error; throw error })
        .finally(() => { loading.getErrorTrend = false })
    }) as AdminOpsQueryRepository['getErrorTrend']

    const getErrorDistribution: AdminOpsQueryRepository['getErrorDistribution'] = ((...args: unknown[]) => {
      loading.getErrorDistribution = true
      errors.getErrorDistribution = null
      return Promise.resolve()
        .then(() => (repo.getErrorDistribution as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getErrorDistribution = error; throw error })
        .finally(() => { loading.getErrorDistribution = false })
    }) as AdminOpsQueryRepository['getErrorDistribution']

    const getImageGenerationStats: AdminOpsQueryRepository['getImageGenerationStats'] = ((...args: unknown[]) => {
      loading.getImageGenerationStats = true
      errors.getImageGenerationStats = null
      return Promise.resolve()
        .then(() => (repo.getImageGenerationStats as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getImageGenerationStats = error; throw error })
        .finally(() => { loading.getImageGenerationStats = false })
    }) as AdminOpsQueryRepository['getImageGenerationStats']

    const getOpenAITokenStats: AdminOpsQueryRepository['getOpenAITokenStats'] = ((...args: unknown[]) => {
      loading.getOpenAITokenStats = true
      errors.getOpenAITokenStats = null
      return Promise.resolve()
        .then(() => (repo.getOpenAITokenStats as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getOpenAITokenStats = error; throw error })
        .finally(() => { loading.getOpenAITokenStats = false })
    }) as AdminOpsQueryRepository['getOpenAITokenStats']

    const getUserUsageStats: AdminOpsQueryRepository['getUserUsageStats'] = ((...args: unknown[]) => {
      loading.getUserUsageStats = true
      errors.getUserUsageStats = null
      return Promise.resolve()
        .then(() => (repo.getUserUsageStats as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getUserUsageStats = error; throw error })
        .finally(() => { loading.getUserUsageStats = false })
    }) as AdminOpsQueryRepository['getUserUsageStats']

    const listErrorLogs: AdminOpsQueryRepository['listErrorLogs'] = ((...args: unknown[]) => {
      loading.listErrorLogs = true
      errors.listErrorLogs = null
      return Promise.resolve()
        .then(() => (repo.listErrorLogs as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.listErrorLogs = error; throw error })
        .finally(() => { loading.listErrorLogs = false })
    }) as AdminOpsQueryRepository['listErrorLogs']

    const getErrorLogDetail: AdminOpsQueryRepository['getErrorLogDetail'] = ((...args: unknown[]) => {
      loading.getErrorLogDetail = true
      errors.getErrorLogDetail = null
      return Promise.resolve()
        .then(() => (repo.getErrorLogDetail as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getErrorLogDetail = error; throw error })
        .finally(() => { loading.getErrorLogDetail = false })
    }) as AdminOpsQueryRepository['getErrorLogDetail']

    const listRequestErrors: AdminOpsQueryRepository['listRequestErrors'] = ((...args: unknown[]) => {
      loading.listRequestErrors = true
      errors.listRequestErrors = null
      return Promise.resolve()
        .then(() => (repo.listRequestErrors as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.listRequestErrors = error; throw error })
        .finally(() => { loading.listRequestErrors = false })
    }) as AdminOpsQueryRepository['listRequestErrors']

    const listUpstreamErrors: AdminOpsQueryRepository['listUpstreamErrors'] = ((...args: unknown[]) => {
      loading.listUpstreamErrors = true
      errors.listUpstreamErrors = null
      return Promise.resolve()
        .then(() => (repo.listUpstreamErrors as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.listUpstreamErrors = error; throw error })
        .finally(() => { loading.listUpstreamErrors = false })
    }) as AdminOpsQueryRepository['listUpstreamErrors']

    const getRequestErrorDetail: AdminOpsQueryRepository['getRequestErrorDetail'] = ((...args: unknown[]) => {
      loading.getRequestErrorDetail = true
      errors.getRequestErrorDetail = null
      return Promise.resolve()
        .then(() => (repo.getRequestErrorDetail as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getRequestErrorDetail = error; throw error })
        .finally(() => { loading.getRequestErrorDetail = false })
    }) as AdminOpsQueryRepository['getRequestErrorDetail']

    const getUpstreamErrorDetail: AdminOpsQueryRepository['getUpstreamErrorDetail'] = ((...args: unknown[]) => {
      loading.getUpstreamErrorDetail = true
      errors.getUpstreamErrorDetail = null
      return Promise.resolve()
        .then(() => (repo.getUpstreamErrorDetail as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getUpstreamErrorDetail = error; throw error })
        .finally(() => { loading.getUpstreamErrorDetail = false })
    }) as AdminOpsQueryRepository['getUpstreamErrorDetail']

    const listRequestErrorUpstreamErrors: AdminOpsQueryRepository['listRequestErrorUpstreamErrors'] = ((...args: unknown[]) => {
      loading.listRequestErrorUpstreamErrors = true
      errors.listRequestErrorUpstreamErrors = null
      return Promise.resolve()
        .then(() => (repo.listRequestErrorUpstreamErrors as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.listRequestErrorUpstreamErrors = error; throw error })
        .finally(() => { loading.listRequestErrorUpstreamErrors = false })
    }) as AdminOpsQueryRepository['listRequestErrorUpstreamErrors']

    const listRequestDetails: AdminOpsQueryRepository['listRequestDetails'] = ((...args: unknown[]) => {
      loading.listRequestDetails = true
      errors.listRequestDetails = null
      return Promise.resolve()
        .then(() => (repo.listRequestDetails as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.listRequestDetails = error; throw error })
        .finally(() => { loading.listRequestDetails = false })
    }) as AdminOpsQueryRepository['listRequestDetails']

    const listAlertRules: AdminOpsQueryRepository['listAlertRules'] = ((...args: unknown[]) => {
      loading.listAlertRules = true
      errors.listAlertRules = null
      return Promise.resolve()
        .then(() => (repo.listAlertRules as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.listAlertRules = error; throw error })
        .finally(() => { loading.listAlertRules = false })
    }) as AdminOpsQueryRepository['listAlertRules']

    const listAlertEvents: AdminOpsQueryRepository['listAlertEvents'] = ((...args: unknown[]) => {
      loading.listAlertEvents = true
      errors.listAlertEvents = null
      return Promise.resolve()
        .then(() => (repo.listAlertEvents as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.listAlertEvents = error; throw error })
        .finally(() => { loading.listAlertEvents = false })
    }) as AdminOpsQueryRepository['listAlertEvents']

    const getAlertEvent: AdminOpsQueryRepository['getAlertEvent'] = ((...args: unknown[]) => {
      loading.getAlertEvent = true
      errors.getAlertEvent = null
      return Promise.resolve()
        .then(() => (repo.getAlertEvent as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getAlertEvent = error; throw error })
        .finally(() => { loading.getAlertEvent = false })
    }) as AdminOpsQueryRepository['getAlertEvent']

    const getEmailNotificationConfig: AdminOpsQueryRepository['getEmailNotificationConfig'] = ((...args: unknown[]) => {
      loading.getEmailNotificationConfig = true
      errors.getEmailNotificationConfig = null
      return Promise.resolve()
        .then(() => (repo.getEmailNotificationConfig as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getEmailNotificationConfig = error; throw error })
        .finally(() => { loading.getEmailNotificationConfig = false })
    }) as AdminOpsQueryRepository['getEmailNotificationConfig']

    const getSettingsSnapshot: AdminOpsQueryRepository['getSettingsSnapshot'] = ((...args: unknown[]) => {
      loading.getSettingsSnapshot = true
      errors.getSettingsSnapshot = null
      return Promise.resolve()
        .then(() => (repo.getSettingsSnapshot as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getSettingsSnapshot = error; throw error })
        .finally(() => { loading.getSettingsSnapshot = false })
    }) as AdminOpsQueryRepository['getSettingsSnapshot']

    const getAlertRuntimeSettings: AdminOpsQueryRepository['getAlertRuntimeSettings'] = ((...args: unknown[]) => {
      loading.getAlertRuntimeSettings = true
      errors.getAlertRuntimeSettings = null
      return Promise.resolve()
        .then(() => (repo.getAlertRuntimeSettings as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getAlertRuntimeSettings = error; throw error })
        .finally(() => { loading.getAlertRuntimeSettings = false })
    }) as AdminOpsQueryRepository['getAlertRuntimeSettings']

    const getRuntimeLogConfig: AdminOpsQueryRepository['getRuntimeLogConfig'] = ((...args: unknown[]) => {
      loading.getRuntimeLogConfig = true
      errors.getRuntimeLogConfig = null
      return Promise.resolve()
        .then(() => (repo.getRuntimeLogConfig as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getRuntimeLogConfig = error; throw error })
        .finally(() => { loading.getRuntimeLogConfig = false })
    }) as AdminOpsQueryRepository['getRuntimeLogConfig']

    const listSystemLogs: AdminOpsQueryRepository['listSystemLogs'] = ((...args: unknown[]) => {
      loading.listSystemLogs = true
      errors.listSystemLogs = null
      return Promise.resolve()
        .then(() => (repo.listSystemLogs as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.listSystemLogs = error; throw error })
        .finally(() => { loading.listSystemLogs = false })
    }) as AdminOpsQueryRepository['listSystemLogs']

    const getSystemLogSinkHealth: AdminOpsQueryRepository['getSystemLogSinkHealth'] = ((...args: unknown[]) => {
      loading.getSystemLogSinkHealth = true
      errors.getSystemLogSinkHealth = null
      return Promise.resolve()
        .then(() => (repo.getSystemLogSinkHealth as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getSystemLogSinkHealth = error; throw error })
        .finally(() => { loading.getSystemLogSinkHealth = false })
    }) as AdminOpsQueryRepository['getSystemLogSinkHealth']

    const getAdvancedSettings: AdminOpsQueryRepository['getAdvancedSettings'] = ((...args: unknown[]) => {
      loading.getAdvancedSettings = true
      errors.getAdvancedSettings = null
      return Promise.resolve()
        .then(() => (repo.getAdvancedSettings as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getAdvancedSettings = error; throw error })
        .finally(() => { loading.getAdvancedSettings = false })
    }) as AdminOpsQueryRepository['getAdvancedSettings']

    return {
      loading,
      errors,
      getConcurrencyStats,
      getUserConcurrencyStats,
      getAccountAvailabilityStats,
      getRealtimeTrafficSummary,
      getDashboardOverview,
      getDashboardSnapshotV2,
      getThroughputTrend,
      getLatencyHistogram,
      getErrorTrend,
      getErrorDistribution,
      getImageGenerationStats,
      getOpenAITokenStats,
      getUserUsageStats,
      listErrorLogs,
      getErrorLogDetail,
      listRequestErrors,
      listUpstreamErrors,
      getRequestErrorDetail,
      getUpstreamErrorDetail,
      listRequestErrorUpstreamErrors,
      listRequestDetails,
      listAlertRules,
      listAlertEvents,
      getAlertEvent,
      getEmailNotificationConfig,
      getSettingsSnapshot,
      getAlertRuntimeSettings,
      getRuntimeLogConfig,
      listSystemLogs,
      getSystemLogSinkHealth,
      getAdvancedSettings,
    }
  })
}

export const useAdminOpsQueryStore = createAdminOpsQueryStore()
