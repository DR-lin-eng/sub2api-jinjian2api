/**
 * AdminSettingsRepository (interface). Auto-generated from adminSettingsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminSettingsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-settings/data/datasources/adminSettingsDatasource'

export type AdminSettingsRepository = {
  normalizePlatformQuotasMap: typeof ds.normalizePlatformQuotasMap
  sanitizePlatformQuotasMap: typeof ds.sanitizePlatformQuotasMap
  normalizeDefaultSubscriptionSettings: typeof ds.normalizeDefaultSubscriptionSettings
  buildAuthSourceDefaultsState: typeof ds.buildAuthSourceDefaultsState
  appendAuthSourceDefaultsToUpdateRequest: typeof ds.appendAuthSourceDefaultsToUpdateRequest
  getPaymentVisibleMethodSourceOptions: typeof ds.getPaymentVisibleMethodSourceOptions
  normalizePaymentVisibleMethodSource: typeof ds.normalizePaymentVisibleMethodSource
  getWeChatConnectModeOptions: typeof ds.getWeChatConnectModeOptions
  normalizeWeChatConnectMode: typeof ds.normalizeWeChatConnectMode
  defaultWeChatConnectScopesForMode: typeof ds.defaultWeChatConnectScopesForMode
  resolveWeChatConnectModeCapabilities: typeof ds.resolveWeChatConnectModeCapabilities
  deriveWeChatConnectStoredMode: typeof ds.deriveWeChatConnectStoredMode
  getSettings: typeof ds.getSettings
  updateSettings: typeof ds.updateSettings
  testSmtpConnection: typeof ds.testSmtpConnection
  sendTestEmail: typeof ds.sendTestEmail
  getEmailTemplates: typeof ds.getEmailTemplates
  getEmailTemplate: typeof ds.getEmailTemplate
  updateEmailTemplate: typeof ds.updateEmailTemplate
  restoreOfficialEmailTemplate: typeof ds.restoreOfficialEmailTemplate
  previewEmailTemplate: typeof ds.previewEmailTemplate
  listAdminApiKeys: typeof ds.listAdminApiKeys
  createAdminApiKey: typeof ds.createAdminApiKey
  updateAdminApiKey: typeof ds.updateAdminApiKey
  rotateAdminApiKey: typeof ds.rotateAdminApiKey
  revokeAdminApiKey: typeof ds.revokeAdminApiKey
  getAdminApiKey: typeof ds.getAdminApiKey
  regenerateAdminApiKey: typeof ds.regenerateAdminApiKey
  deleteAdminApiKey: typeof ds.deleteAdminApiKey
  getOverloadCooldownSettings: typeof ds.getOverloadCooldownSettings
  updateOverloadCooldownSettings: typeof ds.updateOverloadCooldownSettings
  getRateLimit429CooldownSettings: typeof ds.getRateLimit429CooldownSettings
  updateRateLimit429CooldownSettings: typeof ds.updateRateLimit429CooldownSettings
  getGlobalTempUnschedulableSettings: typeof ds.getGlobalTempUnschedulableSettings
  updateGlobalTempUnschedulableSettings: typeof ds.updateGlobalTempUnschedulableSettings
  getStreamTimeoutSettings: typeof ds.getStreamTimeoutSettings
  updateStreamTimeoutSettings: typeof ds.updateStreamTimeoutSettings
  getRectifierSettings: typeof ds.getRectifierSettings
  updateRectifierSettings: typeof ds.updateRectifierSettings
  getBetaPolicySettings: typeof ds.getBetaPolicySettings
  updateBetaPolicySettings: typeof ds.updateBetaPolicySettings
  getWebSearchEmulationConfig: typeof ds.getWebSearchEmulationConfig
  updateWebSearchEmulationConfig: typeof ds.updateWebSearchEmulationConfig
  testWebSearchEmulation: typeof ds.testWebSearchEmulation
  resetWebSearchUsage: typeof ds.resetWebSearchUsage
}
