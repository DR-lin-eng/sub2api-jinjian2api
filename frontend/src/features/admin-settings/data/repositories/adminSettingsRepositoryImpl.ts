/**
 * AdminSettingsRepositoryImpl. Auto-generated from adminSettingsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-settings/data/datasources/adminSettingsDatasource'
import type { AdminSettingsRepository } from '@/features/admin-settings/domain/repositories/adminSettingsRepository'

export class AdminSettingsRepositoryImpl implements AdminSettingsRepository {
  normalizePlatformQuotasMap = ds.normalizePlatformQuotasMap
  sanitizePlatformQuotasMap = ds.sanitizePlatformQuotasMap
  normalizeDefaultSubscriptionSettings = ds.normalizeDefaultSubscriptionSettings
  buildAuthSourceDefaultsState = ds.buildAuthSourceDefaultsState
  appendAuthSourceDefaultsToUpdateRequest = ds.appendAuthSourceDefaultsToUpdateRequest
  getPaymentVisibleMethodSourceOptions = ds.getPaymentVisibleMethodSourceOptions
  normalizePaymentVisibleMethodSource = ds.normalizePaymentVisibleMethodSource
  getWeChatConnectModeOptions = ds.getWeChatConnectModeOptions
  normalizeWeChatConnectMode = ds.normalizeWeChatConnectMode
  defaultWeChatConnectScopesForMode = ds.defaultWeChatConnectScopesForMode
  resolveWeChatConnectModeCapabilities = ds.resolveWeChatConnectModeCapabilities
  deriveWeChatConnectStoredMode = ds.deriveWeChatConnectStoredMode
  getSettings = ds.getSettings
  updateSettings = ds.updateSettings
  testSmtpConnection = ds.testSmtpConnection
  sendTestEmail = ds.sendTestEmail
  getEmailTemplates = ds.getEmailTemplates
  getEmailTemplate = ds.getEmailTemplate
  updateEmailTemplate = ds.updateEmailTemplate
  restoreOfficialEmailTemplate = ds.restoreOfficialEmailTemplate
  previewEmailTemplate = ds.previewEmailTemplate
  listAdminApiKeys = ds.listAdminApiKeys
  createAdminApiKey = ds.createAdminApiKey
  updateAdminApiKey = ds.updateAdminApiKey
  rotateAdminApiKey = ds.rotateAdminApiKey
  revokeAdminApiKey = ds.revokeAdminApiKey
  getAdminApiKey = ds.getAdminApiKey
  regenerateAdminApiKey = ds.regenerateAdminApiKey
  deleteAdminApiKey = ds.deleteAdminApiKey
  getOverloadCooldownSettings = ds.getOverloadCooldownSettings
  updateOverloadCooldownSettings = ds.updateOverloadCooldownSettings
  getRateLimit429CooldownSettings = ds.getRateLimit429CooldownSettings
  updateRateLimit429CooldownSettings = ds.updateRateLimit429CooldownSettings
  getGlobalTempUnschedulableSettings = ds.getGlobalTempUnschedulableSettings
  updateGlobalTempUnschedulableSettings = ds.updateGlobalTempUnschedulableSettings
  getStreamTimeoutSettings = ds.getStreamTimeoutSettings
  updateStreamTimeoutSettings = ds.updateStreamTimeoutSettings
  getRectifierSettings = ds.getRectifierSettings
  updateRectifierSettings = ds.updateRectifierSettings
  getBetaPolicySettings = ds.getBetaPolicySettings
  updateBetaPolicySettings = ds.updateBetaPolicySettings
  getWebSearchEmulationConfig = ds.getWebSearchEmulationConfig
  updateWebSearchEmulationConfig = ds.updateWebSearchEmulationConfig
  testWebSearchEmulation = ds.testWebSearchEmulation
  resetWebSearchUsage = ds.resetWebSearchUsage
}

export const adminSettingsRepository: AdminSettingsRepository = new AdminSettingsRepositoryImpl()
