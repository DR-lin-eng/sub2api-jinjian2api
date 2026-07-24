import type { SystemSettings } from '@/features/admin-settings/domain/models/adminSettings'
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
import type { OverloadCooldownSettings } from '@/features/admin-settings/domain/models/overloadCooldownSettings'
import type { RateLimit429CooldownSettings } from '@/features/admin-settings/domain/models/rateLimit429CooldownSettings'
import type { GlobalTempUnschedulableSettings } from '@/features/admin-settings/domain/models/globalTempUnschedulableSettings'
import type { StreamTimeoutSettings } from '@/features/admin-settings/domain/models/streamTimeoutSettings'
import type { RectifierSettings } from '@/features/admin-settings/domain/models/rectifierSettings'
import type { BetaPolicySettings } from '@/features/admin-settings/domain/models/betaPolicySettings'
import type { WebSearchEmulationConfig } from '@/features/admin-settings/domain/models/webSearchEmulationConfig'
import type { AdminApiKey } from '@/features/admin-settings/domain/models/adminApiKey'
import type { EmailTemplateDetail } from '@/features/admin-settings/domain/models/emailTemplateDetail'

export interface AdminSettingsActionRepository {
  updateSettings(req: UpdateSettingsRequest): Promise<SystemSettings>
  testSmtpConnection(req: TestSmtpRequest): Promise<{ message: string }>
  sendTestEmail(req: SendTestEmailRequest): Promise<{ message: string }>
  updateEmailTemplate(event: string, locale: string, req: UpdateEmailTemplateRequest): Promise<EmailTemplateDetail>
  restoreOfficialEmailTemplate(event: string, locale: string): Promise<EmailTemplateDetail>
  previewEmailTemplate(req: PreviewEmailTemplateRequest): Promise<{ subject: string; html: string }>
  createAdminApiKey(req: CreateAdminApiKeyRequest): Promise<{ key: string; metadata: AdminApiKey }>
  updateAdminApiKey(id: string, req: UpdateAdminApiKeyRequest): Promise<AdminApiKey>
  rotateAdminApiKey(id: string): Promise<{ key: string; metadata: AdminApiKey }>
  revokeAdminApiKey(id: string): Promise<{ message: string }>
  regenerateAdminApiKey(): Promise<{ key: string }>
  deleteAdminApiKey(): Promise<{ message: string }>
  updateOverloadCooldownSettings(req: UpdateOverloadCooldownRequest): Promise<OverloadCooldownSettings>
  updateRateLimit429CooldownSettings(req: UpdateRateLimit429CooldownRequest): Promise<RateLimit429CooldownSettings>
  updateGlobalTempUnschedulableSettings(req: UpdateGlobalTempUnschedulableRequest): Promise<GlobalTempUnschedulableSettings>
  updateStreamTimeoutSettings(req: UpdateStreamTimeoutRequest): Promise<StreamTimeoutSettings>
  updateRectifierSettings(req: UpdateRectifierRequest): Promise<RectifierSettings>
  updateBetaPolicySettings(req: UpdateBetaPolicyRequest): Promise<BetaPolicySettings>
  updateWebSearchEmulationConfig(req: UpdateWebSearchEmulationRequest): Promise<WebSearchEmulationConfig>
  testWebSearchEmulation(query: string, provider?: string): Promise<unknown>
  resetWebSearchUsage(provider: string): Promise<{ message: string }>
}
