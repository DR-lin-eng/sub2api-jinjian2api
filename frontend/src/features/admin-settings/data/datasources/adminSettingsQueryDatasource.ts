import { apiClient } from '@/core/networks/client'
import { AdminSettingsDto } from '@/features/admin-settings/data/models/adminSettingsDto'

export class AdminSettingsQueryDatasource {
  async getSettings(): Promise<AdminSettingsDto> {
    const { data } = await apiClient.get<unknown>('/admin/settings')
    return AdminSettingsDto.fromJson(data)
  }

  async getEmailTemplates(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/email-templates')
    return data
  }

  async getEmailTemplate(event: string, locale: string): Promise<unknown> {
    const { data } = await apiClient.get<unknown>(
      `/admin/settings/email-templates/${encodeURIComponent(event)}/${encodeURIComponent(locale)}`
    )
    return data
  }

  async listAdminApiKeys(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/admin-api-keys')
    return data
  }

  async getAdminApiKey(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/admin-api-key')
    return data
  }

  async getOverloadCooldownSettings(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/overload-cooldown')
    return data
  }

  async getRateLimit429CooldownSettings(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/rate-limit-429-cooldown')
    return data
  }

  async getGlobalTempUnschedulableSettings(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/temp-unschedulable')
    return data
  }

  async getStreamTimeoutSettings(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/stream-timeout')
    return data
  }

  async getRectifierSettings(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/rectifier')
    return data
  }

  async getBetaPolicySettings(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/beta-policy')
    return data
  }

  async getWebSearchEmulationConfig(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/settings/web-search-emulation')
    return data
  }
}

export const adminSettingsQueryDatasource = new AdminSettingsQueryDatasource()
