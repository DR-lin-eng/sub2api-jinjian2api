/**
 * Admin API barrel export
 * Centralized exports for all admin API modules
 */

import dashboardAPI from '@/features/admin-dashboard/data/datasources/adminDashboardDatasource'
import { adminUsersQueryRepository } from '@/features/admin-users/data/repositories/adminUsersQueryRepositoryImpl'
import { adminUsersActionRepository } from '@/features/admin-users/data/repositories/adminUsersActionRepositoryImpl'
import { userAttributesQueryRepository } from '@/features/admin-users/data/repositories/userAttributesQueryRepositoryImpl'
import { userAttributesActionRepository } from '@/features/admin-users/data/repositories/userAttributesActionRepositoryImpl'

const usersAPI = {
  list: adminUsersQueryRepository.list.bind(adminUsersQueryRepository),
  getById: adminUsersQueryRepository.getById.bind(adminUsersQueryRepository),
  getUserApiKeys: adminUsersQueryRepository.getUserApiKeys.bind(adminUsersQueryRepository),
  getUserUsageStats: adminUsersQueryRepository.getUserUsageStats.bind(adminUsersQueryRepository),
  getUserBalanceHistory: adminUsersQueryRepository.getUserBalanceHistory.bind(adminUsersQueryRepository),
  getPlatformQuotas: adminUsersQueryRepository.getPlatformQuotas.bind(adminUsersQueryRepository),
  getBatchPlatformQuotas: adminUsersQueryRepository.getBatchPlatformQuotas.bind(adminUsersQueryRepository),
  create: adminUsersActionRepository.create.bind(adminUsersActionRepository),
  update: adminUsersActionRepository.update.bind(adminUsersActionRepository),
  deleteUser: adminUsersActionRepository.deleteUser.bind(adminUsersActionRepository),
  updateBalance: adminUsersActionRepository.updateBalance.bind(adminUsersActionRepository),
  batchUpdateLimits: adminUsersActionRepository.batchUpdateLimits.bind(adminUsersActionRepository),
  replaceGroup: adminUsersActionRepository.replaceGroup.bind(adminUsersActionRepository),
  bindUserAuthIdentity: adminUsersActionRepository.bindUserAuthIdentity.bind(adminUsersActionRepository),
  updatePlatformQuotas: adminUsersActionRepository.updatePlatformQuotas.bind(adminUsersActionRepository),
  resetPlatformQuotaWindow: adminUsersActionRepository.resetPlatformQuotaWindow.bind(adminUsersActionRepository),
}

const userAttributesAPI = {
  listDefinitions: userAttributesQueryRepository.listDefinitions.bind(userAttributesQueryRepository),
  listEnabledDefinitions: userAttributesQueryRepository.listEnabledDefinitions.bind(userAttributesQueryRepository),
  getUserAttributeValues: userAttributesQueryRepository.getUserAttributeValues.bind(userAttributesQueryRepository),
  getBatchUserAttributes: userAttributesQueryRepository.getBatchUserAttributes.bind(userAttributesQueryRepository),
  createDefinition: userAttributesActionRepository.createDefinition.bind(userAttributesActionRepository),
  updateDefinition: userAttributesActionRepository.updateDefinition.bind(userAttributesActionRepository),
  deleteDefinition: userAttributesActionRepository.deleteDefinition.bind(userAttributesActionRepository),
  reorderDefinitions: userAttributesActionRepository.reorderDefinitions.bind(userAttributesActionRepository),
  updateUserAttributeValues: userAttributesActionRepository.updateUserAttributeValues.bind(userAttributesActionRepository),
}
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
import { adminProxiesQueryDatasource } from '@/features/admin-proxies/data/datasources/adminProxiesQueryDatasource'
import { adminProxiesActionDatasource } from '@/features/admin-proxies/data/datasources/adminProxiesActionDatasource'

const proxiesAPI = {
  list: adminProxiesQueryDatasource.list.bind(adminProxiesQueryDatasource),
  getAll: adminProxiesQueryDatasource.getAll.bind(adminProxiesQueryDatasource),
  getAllWithCount: adminProxiesQueryDatasource.getAllWithCount.bind(adminProxiesQueryDatasource),
  getById: adminProxiesQueryDatasource.getById.bind(adminProxiesQueryDatasource),
  checkProxyQuality: adminProxiesQueryDatasource.checkProxyQuality.bind(adminProxiesQueryDatasource),
  getStats: adminProxiesQueryDatasource.getStats.bind(adminProxiesQueryDatasource),
  getProxyAccounts: adminProxiesQueryDatasource.getProxyAccounts.bind(adminProxiesQueryDatasource),
  exportData: adminProxiesQueryDatasource.exportData.bind(adminProxiesQueryDatasource),
  create: adminProxiesActionDatasource.create.bind(adminProxiesActionDatasource),
  update: adminProxiesActionDatasource.update.bind(adminProxiesActionDatasource),
  delete: adminProxiesActionDatasource.deleteProxy.bind(adminProxiesActionDatasource),
  toggleStatus: adminProxiesActionDatasource.toggleStatus.bind(adminProxiesActionDatasource),
  testProxy: adminProxiesActionDatasource.testProxy.bind(adminProxiesActionDatasource),
  batchCreate: adminProxiesActionDatasource.batchCreate.bind(adminProxiesActionDatasource),
  batchDelete: adminProxiesActionDatasource.batchDelete.bind(adminProxiesActionDatasource),
  importData: adminProxiesActionDatasource.importData.bind(adminProxiesActionDatasource),
}
import { adminRedeemQueryRepository } from '@/features/admin-redeem/data/repositories/adminRedeemQueryRepositoryImpl'
import { adminRedeemActionRepository } from '@/features/admin-redeem/data/repositories/adminRedeemActionRepositoryImpl'

const redeemAPI = {
  list: adminRedeemQueryRepository.list.bind(adminRedeemQueryRepository),
  getById: adminRedeemQueryRepository.getById.bind(adminRedeemQueryRepository),
  getStats: adminRedeemQueryRepository.getStats.bind(adminRedeemQueryRepository),
  exportCodes: adminRedeemQueryRepository.exportCodes.bind(adminRedeemQueryRepository),
  generate: adminRedeemActionRepository.generate.bind(adminRedeemActionRepository),
  delete: adminRedeemActionRepository.deleteCode.bind(adminRedeemActionRepository),
  batchDelete: adminRedeemActionRepository.batchDelete.bind(adminRedeemActionRepository),
  batchUpdate: adminRedeemActionRepository.batchUpdate.bind(adminRedeemActionRepository),
  expire: adminRedeemActionRepository.expire.bind(adminRedeemActionRepository),
}

import { adminAnnouncementsQueryRepository } from '@/features/announcements/data/repositories/adminAnnouncementsQueryRepositoryImpl'
import { adminAnnouncementsActionRepository } from '@/features/announcements/data/repositories/adminAnnouncementsActionRepositoryImpl'

const announcementsAPI = {
  list: adminAnnouncementsQueryRepository.list.bind(adminAnnouncementsQueryRepository),
  getById: adminAnnouncementsQueryRepository.getById.bind(adminAnnouncementsQueryRepository),
  getReadStatus: adminAnnouncementsQueryRepository.getReadStatus.bind(adminAnnouncementsQueryRepository),
  create: adminAnnouncementsActionRepository.create.bind(adminAnnouncementsActionRepository),
  update: adminAnnouncementsActionRepository.update.bind(adminAnnouncementsActionRepository),
  deleteAnnouncement: adminAnnouncementsActionRepository.deleteAnnouncement.bind(adminAnnouncementsActionRepository),
}
import { adminSettingsQueryRepository } from '@/features/admin-settings/data/repositories/adminSettingsQueryRepositoryImpl'
import { adminSettingsActionRepository } from '@/features/admin-settings/data/repositories/adminSettingsActionRepositoryImpl'
import { systemQueryRepository } from '@/features/admin-settings/data/repositories/systemQueryRepositoryImpl'
import { systemActionRepository } from '@/features/admin-settings/data/repositories/systemActionRepositoryImpl'

const settingsAPI = { ...adminSettingsQueryRepository, ...adminSettingsActionRepository }
const systemAPI = { ...systemQueryRepository, ...systemActionRepository }
import subscriptionsAPI from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsDatasource'
import { adminUsageQueryRepository } from '@/features/admin-usage/data/repositories/adminUsageQueryRepositoryImpl'
import { adminUsageActionRepository } from '@/features/admin-usage/data/repositories/adminUsageActionRepositoryImpl'

const usageAPI = {
    searchUsers: adminUsageQueryRepository.searchUsers.bind(adminUsageQueryRepository),
    searchApiKeys: adminUsageQueryRepository.searchApiKeys.bind(adminUsageQueryRepository),
}
const apiKeysAPI = {
    updateApiKeyGroup: (id: number, groupId: number | null) =>
        adminUsageActionRepository.updateApiKeyGroup(id, { group_id: groupId === null ? 0 : groupId }),
}
import { adminOpsQueryRepository } from '@/features/admin-ops/data/repositories/adminOpsQueryRepositoryImpl'
import { adminOpsActionRepository } from '@/features/admin-ops/data/repositories/adminOpsActionRepositoryImpl'

const opsAPI = { ...adminOpsQueryRepository, ...adminOpsActionRepository }
import { errorPassthroughQueryRepository } from '@/features/admin-settings/data/repositories/errorPassthroughQueryRepositoryImpl'
import { errorPassthroughActionRepository } from '@/features/admin-settings/data/repositories/errorPassthroughActionRepositoryImpl'
import { tlsFingerprintProfileQueryRepository } from '@/features/admin-settings/data/repositories/tlsFingerprintProfileQueryRepositoryImpl'
import { tlsFingerprintProfileActionRepository } from '@/features/admin-settings/data/repositories/tlsFingerprintProfileActionRepositoryImpl'

const errorPassthroughAPI = { ...errorPassthroughQueryRepository, ...errorPassthroughActionRepository }
const tlsFingerprintProfileAPI = { ...tlsFingerprintProfileQueryRepository, ...tlsFingerprintProfileActionRepository }
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
import { complianceQueryRepository } from '@/features/admin-settings/data/repositories/complianceQueryRepositoryImpl'
import { complianceActionRepository } from '@/features/admin-settings/data/repositories/complianceActionRepositoryImpl'

const adminComplianceAPI = { ...complianceQueryRepository, ...complianceActionRepository }
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
export type { BalanceHistoryItem } from '@/features/admin-users/domain/models/balanceHistoryItem'
export type { BatchUpdateUserLimitsRequest } from '@/features/admin-users/data/requests_models/batchUpdateUserLimitsRequest'
export type {
    ErrorPassthroughRule
} from '@/features/admin-settings/domain/models/errorPassthrough'
export type {
    CreateErrorPassthroughRuleRequest as CreateRuleRequest,
    UpdateErrorPassthroughRuleRequest as UpdateRuleRequest
} from '@/features/admin-settings/data/requests_models/createErrorPassthroughRuleRequest'
export type {
    TlsFingerprintProfile as TLSFingerprintProfile
} from '@/features/admin-settings/domain/models/tlsFingerprintProfile'
export type {
    CreateTlsFingerprintProfileRequest as CreateProfileRequest
} from '@/features/admin-settings/data/requests_models/createTlsFingerprintProfileRequest'
export type {
    UpdateTlsFingerprintProfileRequest as UpdateProfileRequest
} from '@/features/admin-settings/data/requests_models/updateTlsFingerprintProfileRequest'
export type {
    ContentModerationConfig, ContentModerationLog, ModerationMode
} from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
