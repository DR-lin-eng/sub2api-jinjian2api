/**
 * Transitional admin API compatibility barrel.
 * New code should import the owning feature datasource directly.
 */

import groupsAPI from '@/features/admin-groups/data/datasources/adminGroupsDatasource'
import accountsAPI from '@/features/admin-accounts/data/datasources/adminAccountsDatasource'
import proxiesAPI from '@/features/admin-proxies/data/datasources/adminProxiesDatasource'
import settingsAPI from '@/features/admin-settings/data/datasources/adminSettingsDatasource'
import systemAPI from '@/features/admin-settings/data/datasources/systemDatasource'
import geminiAPI from '@/features/admin-accounts/data/datasources/geminiDatasource'
import antigravityAPI from '@/features/admin-accounts/data/datasources/antigravityDatasource'
import grokAPI from '@/features/admin-accounts/data/datasources/grokDatasource'
import opsAPI from '@/features/admin-ops/data/datasources/adminOpsDatasource'
import errorPassthroughAPI from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'
import dataManagementAPI from '@/features/admin-backup/data/datasources/dataManagementDatasource'
import apiKeysAPI from '@/features/admin-usage/data/datasources/apiKeysDatasource'
import scheduledTestsAPI from '@/features/admin-accounts/data/datasources/scheduledTestsDatasource'
import backupAPI from '@/features/admin-backup/data/datasources/adminBackupDatasource'
import tlsFingerprintProfileAPI from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'
import channelsAPI from '@/features/admin-channels/data/datasources/adminChannelsDatasource'
import channelMonitorAPI from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorDatasource'
import channelMonitorTemplateAPI from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorTemplateDatasource'
import riskControlAPI from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
import adminComplianceAPI from '@/features/admin-settings/data/datasources/complianceDatasource'
import auditAPI from '@/features/admin-audit/data/datasources/adminAuditDatasource'
import clusterAPI from '@/features/admin-cluster/data/datasources/adminClusterDatasource'
import ingressRiskAPI from '@/features/admin-risk-control/data/datasources/ingressRiskDatasource'

/**
 * Unified admin API object for convenient access
 */
export const adminAPI = {
  groups: groupsAPI,
  accounts: accountsAPI,
  proxies: proxiesAPI,
  settings: settingsAPI,
  system: systemAPI,
  gemini: geminiAPI,
  antigravity: antigravityAPI,
  grok: grokAPI,
  ops: opsAPI,
  errorPassthrough: errorPassthroughAPI,
  dataManagement: dataManagementAPI,
  apiKeys: apiKeysAPI,
  scheduledTests: scheduledTestsAPI,
  backup: backupAPI,
  tlsFingerprintProfiles: tlsFingerprintProfileAPI,
  channels: channelsAPI,
  channelMonitor: channelMonitorAPI,
  channelMonitorTemplate: channelMonitorTemplateAPI,
  riskControl: riskControlAPI,
  compliance: adminComplianceAPI,
  audit: auditAPI,
  cluster: clusterAPI,
  ingressRisk: ingressRiskAPI
}

export {
  groupsAPI,
  accountsAPI,
  proxiesAPI,
  settingsAPI,
  systemAPI,
  geminiAPI,
  antigravityAPI,
  grokAPI,
  opsAPI,
  errorPassthroughAPI,
  dataManagementAPI,
  apiKeysAPI,
  scheduledTestsAPI,
  backupAPI,
  tlsFingerprintProfileAPI,
  channelsAPI,
  channelMonitorAPI,
  channelMonitorTemplateAPI,
  riskControlAPI,
  adminComplianceAPI,
  auditAPI,
  clusterAPI,
  ingressRiskAPI
}

export default adminAPI

// Re-export types used by components
export type { AuditLog, AuditLogQuery, AuditLogListResponse } from '@/features/admin-audit/data/datasources/adminAuditDatasource'
export type { ErrorPassthroughRule, CreateRuleRequest, UpdateRuleRequest } from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'
export type { BackupAgentHealth, DataManagementConfig } from '@/features/admin-backup/data/datasources/dataManagementDatasource'
export type { TLSFingerprintProfile, CreateProfileRequest, UpdateProfileRequest } from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'
export type { ContentModerationConfig, ContentModerationLog, ModerationMode } from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
export type {
  AuthCacheHealth,
  IngressCollectorHealth,
  IngressRejection,
  IngressRejectionList,
  IngressRejectionQuery,
  IngressRiskTimeRange,
} from '@/features/admin-risk-control/data/datasources/ingressRiskDatasource'
