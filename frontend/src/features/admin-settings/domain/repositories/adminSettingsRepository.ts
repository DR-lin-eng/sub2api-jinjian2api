/**
 * AdminSettingsRepository (interface). Auto-generated from adminSettingsDatasource.ts.
 */
import type * as ds from '@/features/admin-settings/data/datasources/adminSettingsDatasource'

export type AdminSettingsRepository = {
  readonly normalizePlatformQuotasMap: typeof ds.normalizePlatformQuotasMap
  readonly sanitizePlatformQuotasMap: typeof ds.sanitizePlatformQuotasMap
  readonly normalizeDefaultSubscriptionSettings: typeof ds.normalizeDefaultSubscriptionSettings
  readonly buildAuthSourceDefaultsState: typeof ds.buildAuthSourceDefaultsState
  readonly appendAuthSourceDefaultsToUpdateRequest: typeof ds.appendAuthSourceDefaultsToUpdateRequest
  readonly getPaymentVisibleMethodSourceOptions: typeof ds.getPaymentVisibleMethodSourceOptions
  readonly normalizePaymentVisibleMethodSource: typeof ds.normalizePaymentVisibleMethodSource
  readonly getWeChatConnectModeOptions: typeof ds.getWeChatConnectModeOptions
  readonly normalizeWeChatConnectMode: typeof ds.normalizeWeChatConnectMode
  readonly defaultWeChatConnectScopesForMode: typeof ds.defaultWeChatConnectScopesForMode
  readonly resolveWeChatConnectModeCapabilities: typeof ds.resolveWeChatConnectModeCapabilities
  readonly deriveWeChatConnectStoredMode: typeof ds.deriveWeChatConnectStoredMode
  readonly getSettings: typeof ds.getSettings
  readonly updateSettings: typeof ds.updateSettings
  readonly testSmtpConnection: typeof ds.testSmtpConnection
  readonly sendTestEmail: typeof ds.sendTestEmail
  readonly getEmailTemplates: typeof ds.getEmailTemplates
  readonly getEmailTemplate: typeof ds.getEmailTemplate
  readonly updateEmailTemplate: typeof ds.updateEmailTemplate
  readonly restoreOfficialEmailTemplate: typeof ds.restoreOfficialEmailTemplate
  readonly previewEmailTemplate: typeof ds.previewEmailTemplate
  readonly listAdminApiKeys: typeof ds.listAdminApiKeys
  readonly createAdminApiKey: typeof ds.createAdminApiKey
  readonly updateAdminApiKey: typeof ds.updateAdminApiKey
  readonly rotateAdminApiKey: typeof ds.rotateAdminApiKey
  readonly revokeAdminApiKey: typeof ds.revokeAdminApiKey
  readonly getAdminApiKey: typeof ds.getAdminApiKey
  readonly regenerateAdminApiKey: typeof ds.regenerateAdminApiKey
  readonly deleteAdminApiKey: typeof ds.deleteAdminApiKey
  readonly getOverloadCooldownSettings: typeof ds.getOverloadCooldownSettings
  readonly updateOverloadCooldownSettings: typeof ds.updateOverloadCooldownSettings
  readonly getRateLimit429CooldownSettings: typeof ds.getRateLimit429CooldownSettings
  readonly updateRateLimit429CooldownSettings: typeof ds.updateRateLimit429CooldownSettings
  readonly getGlobalTempUnschedulableSettings: typeof ds.getGlobalTempUnschedulableSettings
  readonly updateGlobalTempUnschedulableSettings: typeof ds.updateGlobalTempUnschedulableSettings
  readonly getStreamTimeoutSettings: typeof ds.getStreamTimeoutSettings
  readonly updateStreamTimeoutSettings: typeof ds.updateStreamTimeoutSettings
  readonly getRectifierSettings: typeof ds.getRectifierSettings
  readonly updateRectifierSettings: typeof ds.updateRectifierSettings
  readonly getBetaPolicySettings: typeof ds.getBetaPolicySettings
  readonly updateBetaPolicySettings: typeof ds.updateBetaPolicySettings
  readonly getWebSearchEmulationConfig: typeof ds.getWebSearchEmulationConfig
  readonly updateWebSearchEmulationConfig: typeof ds.updateWebSearchEmulationConfig
  readonly testWebSearchEmulation: typeof ds.testWebSearchEmulation
  readonly resetWebSearchUsage: typeof ds.resetWebSearchUsage
}
