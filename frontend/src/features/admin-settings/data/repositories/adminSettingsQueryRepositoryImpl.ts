import { adminSettingsQueryDatasource } from '@/features/admin-settings/data/datasources/adminSettingsQueryDatasource'
import type { AdminSettingsQueryRepository } from '@/features/admin-settings/domain/repositories/adminSettingsQueryRepository'
import type { SystemSettings } from '@/features/admin-settings/domain/models/adminSettings'
import type { EmailTemplateSummary } from '@/features/admin-settings/domain/models/emailTemplateSummary'
import type { EmailTemplateDetail } from '@/features/admin-settings/domain/models/emailTemplateDetail'
import type { AdminApiKey } from '@/features/admin-settings/domain/models/adminApiKey'
import type { OverloadCooldownSettings } from '@/features/admin-settings/domain/models/overloadCooldownSettings'
import type { RateLimit429CooldownSettings } from '@/features/admin-settings/domain/models/rateLimit429CooldownSettings'
import type { GlobalTempUnschedulableSettings } from '@/features/admin-settings/domain/models/globalTempUnschedulableSettings'
import type { StreamTimeoutSettings } from '@/features/admin-settings/domain/models/streamTimeoutSettings'
import type { RectifierSettings } from '@/features/admin-settings/domain/models/rectifierSettings'
import type { BetaPolicySettings } from '@/features/admin-settings/domain/models/betaPolicySettings'
import type { WebSearchEmulationConfig } from '@/features/admin-settings/domain/models/webSearchEmulationConfig'

class AdminSettingsQueryRepositoryImpl implements AdminSettingsQueryRepository {
  private readonly ds = adminSettingsQueryDatasource

  getSettings = async () : Promise<SystemSettings>  => {
    return (await this.ds.getSettings()).toEntity()
  }

  getEmailTemplates = async () : Promise<{ events: unknown[]; locales: string[]; templates?: EmailTemplateSummary[] }>  => {
    return await this.ds.getEmailTemplates() as Promise<{ events: unknown[]; locales: string[]; templates?: EmailTemplateSummary[] }>
  }

  getEmailTemplate = async (event: string, locale: string) : Promise<EmailTemplateDetail>  => {
    return await this.ds.getEmailTemplate(event, locale) as Promise<EmailTemplateDetail>
  }

  listAdminApiKeys = async () : Promise<{ items: AdminApiKey[] }>  => {
    return await this.ds.listAdminApiKeys() as Promise<{ items: AdminApiKey[] }>
  }

  getAdminApiKey = async () : Promise<{ exists: boolean; maskedKey: string }>  => {
    const raw = await this.ds.getAdminApiKey() as { exists: boolean; masked_key: string }
    return { exists: raw.exists ?? false, maskedKey: raw.masked_key ?? '' }
  }

  getOverloadCooldownSettings = async () : Promise<OverloadCooldownSettings>  => {
    const raw = await this.ds.getOverloadCooldownSettings() as { enabled: boolean; cooldown_minutes: number }
    const e = new (await import('@/features/admin-settings/domain/models/overloadCooldownSettings')).OverloadCooldownSettings()
    e.enabled = raw.enabled ?? false
    e.cooldownMinutes = raw.cooldown_minutes ?? 0
    return e
  }

  getRateLimit429CooldownSettings = async () : Promise<RateLimit429CooldownSettings>  => {
    const raw = await this.ds.getRateLimit429CooldownSettings() as { enabled: boolean; cooldown_seconds: number }
    const e = new (await import('@/features/admin-settings/domain/models/rateLimit429CooldownSettings')).RateLimit429CooldownSettings()
    e.enabled = raw.enabled ?? false
    e.cooldownSeconds = raw.cooldown_seconds ?? 0
    return e
  }

  getGlobalTempUnschedulableSettings = async () : Promise<GlobalTempUnschedulableSettings>  => {
    const raw = await this.ds.getGlobalTempUnschedulableSettings() as { enabled: boolean }
    const e = new (await import('@/features/admin-settings/domain/models/globalTempUnschedulableSettings')).GlobalTempUnschedulableSettings()
    e.enabled = raw.enabled ?? false
    return e
  }

  getStreamTimeoutSettings = async () : Promise<StreamTimeoutSettings>  => {
    const raw = await this.ds.getStreamTimeoutSettings() as Record<string, unknown>
    const e = new (await import('@/features/admin-settings/domain/models/streamTimeoutSettings')).StreamTimeoutSettings()
    e.enabled = (raw.enabled as boolean) ?? false
    e.action = (raw.action as StreamTimeoutSettings['action']) ?? 'none'
    e.tempUnschedMinutes = (raw.temp_unsched_minutes as number) ?? 0
    e.thresholdCount = (raw.threshold_count as number) ?? 0
    e.thresholdWindowMinutes = (raw.threshold_window_minutes as number) ?? 0
    return e
  }

  getRectifierSettings = async () : Promise<RectifierSettings>  => {
    const raw = await this.ds.getRectifierSettings() as Record<string, unknown>
    const e = new (await import('@/features/admin-settings/domain/models/rectifierSettings')).RectifierSettings()
    e.enabled = (raw.enabled as boolean) ?? false
    e.thinkingSignatureEnabled = (raw.thinking_signature_enabled as boolean) ?? false
    e.thinkingBudgetEnabled = (raw.thinking_budget_enabled as boolean) ?? false
    e.thinkingDisplayMode = (raw.thinking_display_mode as RectifierSettings['thinkingDisplayMode']) ?? 'off'
    e.apikeySignatureEnabled = (raw.apikey_signature_enabled as boolean) ?? false
    e.apikeySignaturePatterns = (raw.apikey_signature_patterns as string[]) ?? []
    return e
  }

  getBetaPolicySettings = async () : Promise<BetaPolicySettings>  => {
    return this.ds.getBetaPolicySettings() as Promise<BetaPolicySettings>
  }

  getWebSearchEmulationConfig = async () : Promise<WebSearchEmulationConfig>  => {
    return this.ds.getWebSearchEmulationConfig() as Promise<WebSearchEmulationConfig>
  }
}

export const adminSettingsQueryRepository: AdminSettingsQueryRepository = new AdminSettingsQueryRepositoryImpl()
