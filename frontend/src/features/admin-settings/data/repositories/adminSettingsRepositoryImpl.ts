/**
 * AdminSettingsRepositoryImpl. Auto-generated from adminSettingsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-settings/data/datasources/adminSettingsDatasource'
import type { AdminSettingsRepository } from '@/features/admin-settings/domain/repositories/adminSettingsRepository'

export class AdminSettingsRepositoryImpl implements AdminSettingsRepository {
  get normalizePlatformQuotasMap(): typeof ds.normalizePlatformQuotasMap { return ds.normalizePlatformQuotasMap }
  get sanitizePlatformQuotasMap(): typeof ds.sanitizePlatformQuotasMap { return ds.sanitizePlatformQuotasMap }
  get normalizeDefaultSubscriptionSettings(): typeof ds.normalizeDefaultSubscriptionSettings { return ds.normalizeDefaultSubscriptionSettings }
  get buildAuthSourceDefaultsState(): typeof ds.buildAuthSourceDefaultsState { return ds.buildAuthSourceDefaultsState }
  get appendAuthSourceDefaultsToUpdateRequest(): typeof ds.appendAuthSourceDefaultsToUpdateRequest { return ds.appendAuthSourceDefaultsToUpdateRequest }
  get getPaymentVisibleMethodSourceOptions(): typeof ds.getPaymentVisibleMethodSourceOptions { return ds.getPaymentVisibleMethodSourceOptions }
  get normalizePaymentVisibleMethodSource(): typeof ds.normalizePaymentVisibleMethodSource { return ds.normalizePaymentVisibleMethodSource }
  get getWeChatConnectModeOptions(): typeof ds.getWeChatConnectModeOptions { return ds.getWeChatConnectModeOptions }
  get normalizeWeChatConnectMode(): typeof ds.normalizeWeChatConnectMode { return ds.normalizeWeChatConnectMode }
  get defaultWeChatConnectScopesForMode(): typeof ds.defaultWeChatConnectScopesForMode { return ds.defaultWeChatConnectScopesForMode }
  get resolveWeChatConnectModeCapabilities(): typeof ds.resolveWeChatConnectModeCapabilities { return ds.resolveWeChatConnectModeCapabilities }
  get deriveWeChatConnectStoredMode(): typeof ds.deriveWeChatConnectStoredMode { return ds.deriveWeChatConnectStoredMode }
  get getSettings(): typeof ds.getSettings { return ds.getSettings }
  get updateSettings(): typeof ds.updateSettings { return ds.updateSettings }
  get testSmtpConnection(): typeof ds.testSmtpConnection { return ds.testSmtpConnection }
  get sendTestEmail(): typeof ds.sendTestEmail { return ds.sendTestEmail }
  get getEmailTemplates(): typeof ds.getEmailTemplates { return ds.getEmailTemplates }
  get getEmailTemplate(): typeof ds.getEmailTemplate { return ds.getEmailTemplate }
  get updateEmailTemplate(): typeof ds.updateEmailTemplate { return ds.updateEmailTemplate }
  get restoreOfficialEmailTemplate(): typeof ds.restoreOfficialEmailTemplate { return ds.restoreOfficialEmailTemplate }
  get previewEmailTemplate(): typeof ds.previewEmailTemplate { return ds.previewEmailTemplate }
  get listAdminApiKeys(): typeof ds.listAdminApiKeys { return ds.listAdminApiKeys }
  get createAdminApiKey(): typeof ds.createAdminApiKey { return ds.createAdminApiKey }
  get updateAdminApiKey(): typeof ds.updateAdminApiKey { return ds.updateAdminApiKey }
  get rotateAdminApiKey(): typeof ds.rotateAdminApiKey { return ds.rotateAdminApiKey }
  get revokeAdminApiKey(): typeof ds.revokeAdminApiKey { return ds.revokeAdminApiKey }
  get getAdminApiKey(): typeof ds.getAdminApiKey { return ds.getAdminApiKey }
  get regenerateAdminApiKey(): typeof ds.regenerateAdminApiKey { return ds.regenerateAdminApiKey }
  get deleteAdminApiKey(): typeof ds.deleteAdminApiKey { return ds.deleteAdminApiKey }
  get getOverloadCooldownSettings(): typeof ds.getOverloadCooldownSettings { return ds.getOverloadCooldownSettings }
  get updateOverloadCooldownSettings(): typeof ds.updateOverloadCooldownSettings { return ds.updateOverloadCooldownSettings }
  get getRateLimit429CooldownSettings(): typeof ds.getRateLimit429CooldownSettings { return ds.getRateLimit429CooldownSettings }
  get updateRateLimit429CooldownSettings(): typeof ds.updateRateLimit429CooldownSettings { return ds.updateRateLimit429CooldownSettings }
  get getGlobalTempUnschedulableSettings(): typeof ds.getGlobalTempUnschedulableSettings { return ds.getGlobalTempUnschedulableSettings }
  get updateGlobalTempUnschedulableSettings(): typeof ds.updateGlobalTempUnschedulableSettings { return ds.updateGlobalTempUnschedulableSettings }
  get getStreamTimeoutSettings(): typeof ds.getStreamTimeoutSettings { return ds.getStreamTimeoutSettings }
  get updateStreamTimeoutSettings(): typeof ds.updateStreamTimeoutSettings { return ds.updateStreamTimeoutSettings }
  get getRectifierSettings(): typeof ds.getRectifierSettings { return ds.getRectifierSettings }
  get updateRectifierSettings(): typeof ds.updateRectifierSettings { return ds.updateRectifierSettings }
  get getBetaPolicySettings(): typeof ds.getBetaPolicySettings { return ds.getBetaPolicySettings }
  get updateBetaPolicySettings(): typeof ds.updateBetaPolicySettings { return ds.updateBetaPolicySettings }
  get getWebSearchEmulationConfig(): typeof ds.getWebSearchEmulationConfig { return ds.getWebSearchEmulationConfig }
  get updateWebSearchEmulationConfig(): typeof ds.updateWebSearchEmulationConfig { return ds.updateWebSearchEmulationConfig }
  get testWebSearchEmulation(): typeof ds.testWebSearchEmulation { return ds.testWebSearchEmulation }
  get resetWebSearchUsage(): typeof ds.resetWebSearchUsage { return ds.resetWebSearchUsage }
}

export const adminSettingsRepository: AdminSettingsRepository = new AdminSettingsRepositoryImpl()
