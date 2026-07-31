import { adminSettingsActionDatasource } from '@/features/admin-settings/data/datasources/adminSettingsActionDatasource'
import type { AdminSettingsActionRepository } from '@/features/admin-settings/domain/repositories/adminSettingsActionRepository'
import type { SystemSettings } from '@/features/admin-settings/domain/models/adminSettings'
import type { EmailTemplateDetail } from '@/features/admin-settings/domain/models/emailTemplateDetail'
import type { AdminApiKey } from '@/features/admin-settings/domain/models/adminApiKey'
import type { OverloadCooldownSettings } from '@/features/admin-settings/domain/models/overloadCooldownSettings'
import type { RateLimit429CooldownSettings } from '@/features/admin-settings/domain/models/rateLimit429CooldownSettings'
import type { GlobalTempUnschedulableSettings } from '@/features/admin-settings/domain/models/globalTempUnschedulableSettings'
import type { StreamTimeoutSettings } from '@/features/admin-settings/domain/models/streamTimeoutSettings'
import type { RectifierSettings } from '@/features/admin-settings/domain/models/rectifierSettings'
import type { BetaPolicySettings } from '@/features/admin-settings/domain/models/betaPolicySettings'
import type { WebSearchEmulationConfig } from '@/features/admin-settings/domain/models/webSearchEmulationConfig'
import type { UpdateSettingsRequest } from '@/features/admin-settings/data/requests_models/updateSettingsRequest'
import type { TestSmtpRequest } from '@/features/admin-settings/data/requests_models/testSmtpRequest'
import type { SendTestEmailRequest } from '@/features/admin-settings/data/requests_models/sendTestEmailRequest'
import type { UpdateEmailTemplateRequest } from '@/features/admin-settings/data/requests_models/updateEmailTemplateRequest'
import type { PreviewEmailTemplateRequest } from '@/features/admin-settings/data/requests_models/previewEmailTemplateRequest'
import type { CreateAdminApiKeyRequest } from '@/features/admin-settings/data/requests_models/createAdminApiKeyRequest'
import type { UpdateAdminApiKeyRequest } from '@/features/admin-settings/data/requests_models/updateAdminApiKeyRequest'
import type { UpdateOverloadCooldownRequest } from '@/features/admin-settings/data/requests_models/updateOverloadCooldownRequest'
import type { UpdateRateLimit429CooldownRequest } from '@/features/admin-settings/data/requests_models/updateRateLimit429CooldownRequest'
import type { UpdateGlobalTempUnschedulableRequest } from '@/features/admin-settings/data/requests_models/updateGlobalTempUnschedulableRequest'
import type { UpdateStreamTimeoutRequest } from '@/features/admin-settings/data/requests_models/updateStreamTimeoutRequest'
import type { UpdateRectifierRequest } from '@/features/admin-settings/data/requests_models/updateRectifierRequest'
import type { UpdateBetaPolicyRequest } from '@/features/admin-settings/data/requests_models/updateBetaPolicyRequest'
import type { UpdateWebSearchEmulationRequest } from '@/features/admin-settings/data/requests_models/updateWebSearchEmulationRequest'
import {
  OverloadCooldownSettings as OverloadCooldownSettingsClass,
} from '@/features/admin-settings/domain/models/overloadCooldownSettings'
import {
  RateLimit429CooldownSettings as RateLimit429CooldownSettingsClass,
} from '@/features/admin-settings/domain/models/rateLimit429CooldownSettings'
import {
  GlobalTempUnschedulableSettings as GlobalTempUnschedulableSettingsClass,
} from '@/features/admin-settings/domain/models/globalTempUnschedulableSettings'
import {
  StreamTimeoutSettings as StreamTimeoutSettingsClass,
} from '@/features/admin-settings/domain/models/streamTimeoutSettings'
import {
  RectifierSettings as RectifierSettingsClass,
} from '@/features/admin-settings/domain/models/rectifierSettings'

class AdminSettingsActionRepositoryImpl implements AdminSettingsActionRepository {
  private readonly ds = adminSettingsActionDatasource

  updateSettings = async (req: UpdateSettingsRequest) : Promise<SystemSettings>  => {
    return (await this.ds.updateSettings(req)).toEntity()
  }

  testSmtpConnection = async (req: TestSmtpRequest) : Promise<{ message: string }>  => {
    return this.ds.testSmtpConnection(req)
  }

  sendTestEmail = async (req: SendTestEmailRequest) : Promise<{ message: string }>  => {
    return this.ds.sendTestEmail(req)
  }

  updateEmailTemplate = async (event: string, locale: string, req: UpdateEmailTemplateRequest) : Promise<EmailTemplateDetail>  => {
    return await this.ds.updateEmailTemplate(event, locale, req) as Promise<EmailTemplateDetail>
  }

  restoreOfficialEmailTemplate = async (event: string, locale: string) : Promise<EmailTemplateDetail>  => {
    return await this.ds.restoreOfficialEmailTemplate(event, locale) as Promise<EmailTemplateDetail>
  }

  previewEmailTemplate = async (req: PreviewEmailTemplateRequest) : Promise<{ subject: string; html: string }>  => {
    return await this.ds.previewEmailTemplate(req) as Promise<{ subject: string; html: string }>
  }

  createAdminApiKey = async (req: CreateAdminApiKeyRequest) : Promise<{ key: string; metadata: AdminApiKey }>  => {
    return await this.ds.createAdminApiKey(req) as Promise<{ key: string; metadata: AdminApiKey }>
  }

  updateAdminApiKey = async (id: string, req: UpdateAdminApiKeyRequest) : Promise<AdminApiKey>  => {
    return await this.ds.updateAdminApiKey(id, req) as Promise<AdminApiKey>
  }

  rotateAdminApiKey = async (id: string) : Promise<{ key: string; metadata: AdminApiKey }>  => {
    return await this.ds.rotateAdminApiKey(id) as Promise<{ key: string; metadata: AdminApiKey }>
  }

  revokeAdminApiKey = async (id: string) : Promise<{ message: string }>  => {
    return this.ds.revokeAdminApiKey(id)
  }

  regenerateAdminApiKey = async () : Promise<{ key: string }>  => {
    return await this.ds.regenerateAdminApiKey() as Promise<{ key: string }>
  }

  deleteAdminApiKey = async () : Promise<{ message: string }>  => {
    return this.ds.deleteAdminApiKey()
  }

  updateOverloadCooldownSettings = async (req: UpdateOverloadCooldownRequest) : Promise<OverloadCooldownSettings>  => {
    const raw = await this.ds.updateOverloadCooldownSettings(req) as { enabled: boolean; cooldown_minutes: number }
    const e = new OverloadCooldownSettingsClass()
    e.enabled = raw.enabled ?? false
    e.cooldownMinutes = raw.cooldown_minutes ?? 0
    return e
  }

  updateRateLimit429CooldownSettings = async (req: UpdateRateLimit429CooldownRequest) : Promise<RateLimit429CooldownSettings>  => {
    const raw = await this.ds.updateRateLimit429CooldownSettings(req) as { enabled: boolean; cooldown_seconds: number }
    const e = new RateLimit429CooldownSettingsClass()
    e.enabled = raw.enabled ?? false
    e.cooldownSeconds = raw.cooldown_seconds ?? 0
    return e
  }

  updateGlobalTempUnschedulableSettings = async (req: UpdateGlobalTempUnschedulableRequest) : Promise<GlobalTempUnschedulableSettings>  => {
    const raw = await this.ds.updateGlobalTempUnschedulableSettings(req) as { enabled: boolean }
    const e = new GlobalTempUnschedulableSettingsClass()
    e.enabled = raw.enabled ?? false
    return e
  }

  updateStreamTimeoutSettings = async (req: UpdateStreamTimeoutRequest) : Promise<StreamTimeoutSettings>  => {
    const raw = await this.ds.updateStreamTimeoutSettings(req) as Record<string, unknown>
    const e = new StreamTimeoutSettingsClass()
    e.enabled = (raw.enabled as boolean) ?? false
    e.action = (raw.action as StreamTimeoutSettings['action']) ?? 'none'
    e.tempUnschedMinutes = (raw.temp_unsched_minutes as number) ?? 0
    e.thresholdCount = (raw.threshold_count as number) ?? 0
    e.thresholdWindowMinutes = (raw.threshold_window_minutes as number) ?? 0
    return e
  }

  updateRectifierSettings = async (req: UpdateRectifierRequest) : Promise<RectifierSettings>  => {
    const raw = await this.ds.updateRectifierSettings(req) as Record<string, unknown>
    const e = new RectifierSettingsClass()
    e.enabled = (raw.enabled as boolean) ?? false
    e.thinkingSignatureEnabled = (raw.thinking_signature_enabled as boolean) ?? false
    e.thinkingBudgetEnabled = (raw.thinking_budget_enabled as boolean) ?? false
    e.thinkingDisplayMode = (raw.thinking_display_mode as RectifierSettings['thinkingDisplayMode']) ?? 'off'
    e.apikeySignatureEnabled = (raw.apikey_signature_enabled as boolean) ?? false
    e.apikeySignaturePatterns = (raw.apikey_signature_patterns as string[]) ?? []
    return e
  }

  updateBetaPolicySettings = async (req: UpdateBetaPolicyRequest) : Promise<BetaPolicySettings>  => {
    return this.ds.updateBetaPolicySettings(req) as Promise<BetaPolicySettings>
  }

  updateWebSearchEmulationConfig = async (req: UpdateWebSearchEmulationRequest) : Promise<WebSearchEmulationConfig>  => {
    return this.ds.updateWebSearchEmulationConfig(req) as Promise<WebSearchEmulationConfig>
  }

  testWebSearchEmulation = async (query: string, provider?: string) : Promise<unknown>  => {
    return this.ds.testWebSearchEmulation(query, provider)
  }

  resetWebSearchUsage = async (provider: string) : Promise<{ message: string }>  => {
    return this.ds.resetWebSearchUsage(provider)
  }
}

export const adminSettingsActionRepository: AdminSettingsActionRepository = new AdminSettingsActionRepositoryImpl()
