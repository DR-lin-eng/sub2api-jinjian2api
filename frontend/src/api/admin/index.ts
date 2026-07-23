/**
 * Admin API barrel export
 * Centralized exports for all admin API modules
 */

import dashboardAPI from '@/features/admin-dashboard/data/datasources/adminDashboardDatasource'
import usersAPI from '@/features/admin-users/data/datasources/adminUsersDatasource'
import { adminGroupsQueryRepository } from '@/features/admin-groups/data/repositories/adminGroupsQueryRepositoryImpl'
import { adminGroupsActionRepository } from '@/features/admin-groups/data/repositories/adminGroupsActionRepositoryImpl'

const groupsAPI = {
  list: adminGroupsQueryRepository.list.bind(adminGroupsQueryRepository),
  getAll: adminGroupsQueryRepository.getAll.bind(adminGroupsQueryRepository),
  getAllIncludingInactive: adminGroupsQueryRepository.getAllIncludingInactive.bind(adminGroupsQueryRepository),
  getByPlatform: adminGroupsQueryRepository.getByPlatform.bind(adminGroupsQueryRepository),
  getById: adminGroupsQueryRepository.getById.bind(adminGroupsQueryRepository),
  getModelsListCandidates: adminGroupsQueryRepository.getModelsListCandidates.bind(adminGroupsQueryRepository),
  getStats: adminGroupsQueryRepository.getStats.bind(adminGroupsQueryRepository),
  getGroupApiKeys: adminGroupsQueryRepository.getGroupApiKeys.bind(adminGroupsQueryRepository),
  listCompositeRoutes: adminGroupsQueryRepository.listCompositeRoutes.bind(adminGroupsQueryRepository),
  previewCompositeRoute: adminGroupsQueryRepository.previewCompositeRoute.bind(adminGroupsQueryRepository),
  getGroupRateMultipliers: adminGroupsQueryRepository.getGroupRateMultipliers.bind(adminGroupsQueryRepository),
  getGroupRPMOverrides: adminGroupsQueryRepository.getGroupRPMOverrides.bind(adminGroupsQueryRepository),
  getUsageSummary: adminGroupsQueryRepository.getUsageSummary.bind(adminGroupsQueryRepository),
  getCapacitySummary: adminGroupsQueryRepository.getCapacitySummary.bind(adminGroupsQueryRepository),
  create: adminGroupsActionRepository.create.bind(adminGroupsActionRepository),
  duplicate: adminGroupsActionRepository.duplicate.bind(adminGroupsActionRepository),
  update: adminGroupsActionRepository.update.bind(adminGroupsActionRepository),
  delete: adminGroupsActionRepository.deleteGroup.bind(adminGroupsActionRepository),
  toggleStatus: adminGroupsActionRepository.toggleStatus.bind(adminGroupsActionRepository),
  createCompositeRoute: adminGroupsActionRepository.createCompositeRoute.bind(adminGroupsActionRepository),
  updateCompositeRoute: adminGroupsActionRepository.updateCompositeRoute.bind(adminGroupsActionRepository),
  deleteCompositeRoute: adminGroupsActionRepository.deleteCompositeRoute.bind(adminGroupsActionRepository),
  updateSortOrder: adminGroupsActionRepository.updateSortOrder.bind(adminGroupsActionRepository),
  clearGroupRateMultipliers: adminGroupsActionRepository.clearGroupRateMultipliers.bind(adminGroupsActionRepository),
  batchSetGroupRateMultipliers: adminGroupsActionRepository.batchSetGroupRateMultipliers.bind(adminGroupsActionRepository),
  batchSetGroupRPMOverrides: adminGroupsActionRepository.batchSetGroupRPMOverrides.bind(adminGroupsActionRepository),
  clearGroupRPMOverrides: adminGroupsActionRepository.clearGroupRPMOverrides.bind(adminGroupsActionRepository),
}
import proxiesAPI from '@/features/admin-proxies/data/datasources/adminProxiesDatasource'
import redeemAPI from '@/features/admin-redeem/data/datasources/adminRedeemDatasource'

import announcementsAPI from '@/features/announcements/data/datasources/adminAnnouncementsDatasource'
import settingsAPI from '@/features/admin-settings/data/datasources/adminSettingsDatasource'
import systemAPI from '@/features/admin-settings/data/datasources/systemDatasource'
import subscriptionsAPI from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsDatasource'
import usageAPI from '@/features/admin-usage/data/datasources/adminUsageDatasource'
import userAttributesAPI from '@/features/admin-users/data/datasources/userAttributesDatasource'
import opsAPI from '@/features/admin-ops/data/datasources/adminOpsDatasource'
import errorPassthroughAPI from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'
import apiKeysAPI from '@/features/admin-usage/data/datasources/apiKeysDatasource'
import tlsFingerprintProfileAPI from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'
import { adminChannelsQueryRepository } from '@/features/admin-channels/data/repositories/adminChannelsQueryRepositoryImpl'
import { adminChannelsActionRepository } from '@/features/admin-channels/data/repositories/adminChannelsActionRepositoryImpl'

const channelsAPI = {
    list: adminChannelsQueryRepository.list.bind(adminChannelsQueryRepository),
    getById: adminChannelsQueryRepository.getById.bind(adminChannelsQueryRepository),
    getModelDefaultPricing: adminChannelsQueryRepository.getModelDefaultPricing.bind(adminChannelsQueryRepository),
    create: adminChannelsActionRepository.create.bind(adminChannelsActionRepository),
    update: adminChannelsActionRepository.update.bind(adminChannelsActionRepository),
    remove: adminChannelsActionRepository.remove.bind(adminChannelsActionRepository),
    syncPricingModels: adminChannelsActionRepository.syncPricingModels.bind(adminChannelsActionRepository),
}
import { adminChannelMonitorQueryRepository } from '@/features/admin-channel-monitor/data/repositories/adminChannelMonitorQueryRepositoryImpl'
import { adminChannelMonitorActionRepository } from '@/features/admin-channel-monitor/data/repositories/adminChannelMonitorActionRepositoryImpl'

const channelMonitorAPI = {
    list: adminChannelMonitorQueryRepository.list.bind(adminChannelMonitorQueryRepository),
    get: adminChannelMonitorQueryRepository.getById.bind(adminChannelMonitorQueryRepository),
    listHistory: adminChannelMonitorQueryRepository.listHistory.bind(adminChannelMonitorQueryRepository),
    create: adminChannelMonitorActionRepository.create.bind(adminChannelMonitorActionRepository),
    update: adminChannelMonitorActionRepository.update.bind(adminChannelMonitorActionRepository),
    del: adminChannelMonitorActionRepository.deleteMonitor.bind(adminChannelMonitorActionRepository),
    runNow: adminChannelMonitorActionRepository.runNow.bind(adminChannelMonitorActionRepository),
    duplicate: adminChannelMonitorActionRepository.duplicate.bind(adminChannelMonitorActionRepository),
}

const channelMonitorTemplateAPI = {
    list: adminChannelMonitorQueryRepository.listTemplates.bind(adminChannelMonitorQueryRepository),
    get: adminChannelMonitorQueryRepository.getTemplateById.bind(adminChannelMonitorQueryRepository),
    listAssociatedMonitors: adminChannelMonitorQueryRepository.listAssociatedMonitors.bind(adminChannelMonitorQueryRepository),
    create: adminChannelMonitorActionRepository.createTemplate.bind(adminChannelMonitorActionRepository),
    update: adminChannelMonitorActionRepository.updateTemplate.bind(adminChannelMonitorActionRepository),
    del: adminChannelMonitorActionRepository.deleteTemplate.bind(adminChannelMonitorActionRepository),
    apply: adminChannelMonitorActionRepository.applyTemplate.bind(adminChannelMonitorActionRepository),
}
import { adminOrdersQueryRepository } from '@/features/admin-orders/data/repositories/adminOrdersQueryRepositoryImpl'
import { adminOrdersActionRepository } from '@/features/admin-orders/data/repositories/adminOrdersActionRepositoryImpl'

const adminPaymentAPI = {
    getConfig: adminOrdersQueryRepository.getConfig.bind(adminOrdersQueryRepository),
    getDashboard: adminOrdersQueryRepository.getDashboard.bind(adminOrdersQueryRepository),
    getOrders: adminOrdersQueryRepository.getOrders.bind(adminOrdersQueryRepository),
    getOrder: adminOrdersQueryRepository.getOrder.bind(adminOrdersQueryRepository),
    getPlans: adminOrdersQueryRepository.getPlans.bind(adminOrdersQueryRepository),
    getProviders: adminOrdersQueryRepository.getProviders.bind(adminOrdersQueryRepository),
    updateConfig: adminOrdersActionRepository.updateConfig.bind(adminOrdersActionRepository),
    cancelOrder: adminOrdersActionRepository.cancelOrder.bind(adminOrdersActionRepository),
    retryRecharge: adminOrdersActionRepository.retryRecharge.bind(adminOrdersActionRepository),
    refundOrder: adminOrdersActionRepository.refundOrder.bind(adminOrdersActionRepository),
    queryRefund: adminOrdersActionRepository.queryRefund.bind(adminOrdersActionRepository),
    createPlan: adminOrdersActionRepository.createPlan.bind(adminOrdersActionRepository),
    updatePlan: adminOrdersActionRepository.updatePlan.bind(adminOrdersActionRepository),
    deletePlan: adminOrdersActionRepository.deletePlan.bind(adminOrdersActionRepository),
    createProvider: adminOrdersActionRepository.createProvider.bind(adminOrdersActionRepository),
    updateProvider: adminOrdersActionRepository.updateProvider.bind(adminOrdersActionRepository),
    deleteProvider: adminOrdersActionRepository.deleteProvider.bind(adminOrdersActionRepository),
}
import affiliatesAPI from '@/features/affiliate/data/datasources/adminAffiliatesDatasource'
import riskControlAPI from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
import adminComplianceAPI from '@/features/admin-settings/data/datasources/complianceDatasource'
import auditAPI from '@/features/admin-audit/data/datasources/adminAuditDatasource'
import { adminClusterQueryRepository } from '@/features/admin-cluster/data/repositories/adminClusterQueryRepositoryImpl'

const clusterAPI = {
    getStatus: adminClusterQueryRepository.getStatus.bind(adminClusterQueryRepository),
}

/**
 * Unified admin API object for convenient access
 */
export const adminAPI = {
    dashboard: dashboardAPI,
    users: usersAPI,
    groups: groupsAPI,
    proxies: proxiesAPI,
    redeem: redeemAPI,

    announcements: announcementsAPI,
    settings: settingsAPI,
    system: systemAPI,
    subscriptions: subscriptionsAPI,
    usage: usageAPI,
    userAttributes: userAttributesAPI,
    ops: opsAPI,
    errorPassthrough: errorPassthroughAPI,
    apiKeys: apiKeysAPI,
    tlsFingerprintProfiles: tlsFingerprintProfileAPI,
    channels: channelsAPI,
    channelMonitor: channelMonitorAPI,
    channelMonitorTemplate: channelMonitorTemplateAPI,
    payment: adminPaymentAPI,
    affiliates: affiliatesAPI,
    riskControl: riskControlAPI,
    compliance: adminComplianceAPI,
    audit: auditAPI,
    cluster: clusterAPI
}

export {
    dashboardAPI,
    usersAPI,
    groupsAPI,
    proxiesAPI,
    redeemAPI,

    announcementsAPI,
    settingsAPI,
    systemAPI,
    subscriptionsAPI,
    usageAPI,
    userAttributesAPI,
    opsAPI,
    errorPassthroughAPI,
    apiKeysAPI,
    tlsFingerprintProfileAPI,
    channelsAPI,
    channelMonitorAPI,
    channelMonitorTemplateAPI,
    adminPaymentAPI,
    affiliatesAPI,
    riskControlAPI,
    adminComplianceAPI,
    auditAPI,
    clusterAPI
}

export default adminAPI

// Re-export types used by components
export type {
    AuditLog, AuditLogQuery, AuditLogListResponse
} from '@/features/admin-audit/data/datasources/adminAuditDatasource'
export type {BalanceHistoryItem} from '@/features/admin-users/data/datasources/adminUsersDatasource'
export type {
    ErrorPassthroughRule, CreateRuleRequest, UpdateRuleRequest
} from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'
export type {
    TLSFingerprintProfile, CreateProfileRequest, UpdateProfileRequest
} from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'
export type {
    ContentModerationConfig, ContentModerationLog, ModerationMode
} from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
