import type { SystemSettings } from '@/features/admin-settings/domain/models/adminSettings'
import type { OverloadCooldownSettings } from '@/features/admin-settings/domain/models/overloadCooldownSettings'
import type { RateLimit429CooldownSettings } from '@/features/admin-settings/domain/models/rateLimit429CooldownSettings'
import type { GlobalTempUnschedulableSettings } from '@/features/admin-settings/domain/models/globalTempUnschedulableSettings'
import type { StreamTimeoutSettings } from '@/features/admin-settings/domain/models/streamTimeoutSettings'
import type { RectifierSettings } from '@/features/admin-settings/domain/models/rectifierSettings'
import type { BetaPolicySettings } from '@/features/admin-settings/domain/models/betaPolicySettings'
import type { WebSearchEmulationConfig } from '@/features/admin-settings/domain/models/webSearchEmulationConfig'
import type { AdminApiKey } from '@/features/admin-settings/domain/models/adminApiKey'
import type { EmailTemplateSummary } from '@/features/admin-settings/domain/models/emailTemplateSummary'
import type { EmailTemplateDetail } from '@/features/admin-settings/domain/models/emailTemplateDetail'

export interface AdminSettingsQueryRepository {
  getSettings(): Promise<SystemSettings>
  getEmailTemplates(): Promise<{ events: unknown[]; locales: string[]; templates?: EmailTemplateSummary[] }>
  getEmailTemplate(event: string, locale: string): Promise<EmailTemplateDetail>
  listAdminApiKeys(): Promise<{ items: AdminApiKey[] }>
  getAdminApiKey(): Promise<{ exists: boolean; maskedKey: string }>
  getOverloadCooldownSettings(): Promise<OverloadCooldownSettings>
  getRateLimit429CooldownSettings(): Promise<RateLimit429CooldownSettings>
  getGlobalTempUnschedulableSettings(): Promise<GlobalTempUnschedulableSettings>
  getStreamTimeoutSettings(): Promise<StreamTimeoutSettings>
  getRectifierSettings(): Promise<RectifierSettings>
  getBetaPolicySettings(): Promise<BetaPolicySettings>
  getWebSearchEmulationConfig(): Promise<WebSearchEmulationConfig>
}
