import { apiClient } from '@/core/networks/client'
import { AdminSettingsDto } from '@/features/admin-settings/data/models/adminSettingsDto'
import type { UpdateSettingsRequest } from '@/features/admin-settings/data/requests_models/updateSettingsRequest'
import type { TestSmtpRequest } from '@/features/admin-settings/data/requests_models/testSmtpRequest'
import type { SendTestEmailRequest } from '@/features/admin-settings/data/requests_models/sendTestEmailRequest'
import type { UpdateEmailTemplateRequest } from '@/features/admin-settings/data/requests_models/updateEmailTemplateRequest'
import type { CreateAdminApiKeyRequest } from '@/features/admin-settings/data/requests_models/createAdminApiKeyRequest'
import type { UpdateAdminApiKeyRequest } from '@/features/admin-settings/data/requests_models/updateAdminApiKeyRequest'
import type { UpdateOverloadCooldownRequest } from '@/features/admin-settings/data/requests_models/updateOverloadCooldownRequest'
import type { UpdateRateLimit429CooldownRequest } from '@/features/admin-settings/data/requests_models/updateRateLimit429CooldownRequest'
import type { UpdateGlobalTempUnschedulableRequest } from '@/features/admin-settings/data/requests_models/updateGlobalTempUnschedulableRequest'
import type { UpdateStreamTimeoutRequest } from '@/features/admin-settings/data/requests_models/updateStreamTimeoutRequest'
import type { UpdateRectifierRequest } from '@/features/admin-settings/data/requests_models/updateRectifierRequest'
import type { UpdateBetaPolicyRequest } from '@/features/admin-settings/data/requests_models/updateBetaPolicyRequest'
import type { UpdateWebSearchEmulationRequest } from '@/features/admin-settings/data/requests_models/updateWebSearchEmulationRequest'
import type { PreviewEmailTemplateRequest } from '@/features/admin-settings/data/requests_models/previewEmailTemplateRequest'

export class AdminSettingsActionDatasource {
  async updateSettings(req: UpdateSettingsRequest): Promise<AdminSettingsDto> {
    const { data } = await apiClient.put<unknown>('/admin/settings', req)
    return AdminSettingsDto.fromJson(data)
  }

  async testSmtpConnection(req: TestSmtpRequest): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/admin/settings/test-smtp', req)
    return data
  }

  async sendTestEmail(req: SendTestEmailRequest): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/admin/settings/send-test-email', req)
    return data
  }

  async updateEmailTemplate(event: string, locale: string, req: UpdateEmailTemplateRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>(
      `/admin/settings/email-templates/${encodeURIComponent(event)}/${encodeURIComponent(locale)}`,
      req
    )
    return data
  }

  async restoreOfficialEmailTemplate(event: string, locale: string): Promise<unknown> {
    const { data } = await apiClient.post<unknown>(
      `/admin/settings/email-templates/${encodeURIComponent(event)}/${encodeURIComponent(locale)}/restore-official`
    )
    return data
  }

  async previewEmailTemplate(req: PreviewEmailTemplateRequest): Promise<unknown> {
    const { data } = await apiClient.post<unknown>('/admin/settings/email-template-preview', req)
    return data
  }

  async createAdminApiKey(req: CreateAdminApiKeyRequest): Promise<unknown> {
    const { data } = await apiClient.post<unknown>('/admin/settings/admin-api-keys', req)
    return data
  }

  async updateAdminApiKey(id: string, req: UpdateAdminApiKeyRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>(`/admin/settings/admin-api-keys/${encodeURIComponent(id)}`, req)
    return data
  }

  async rotateAdminApiKey(id: string): Promise<unknown> {
    const { data } = await apiClient.post<unknown>(`/admin/settings/admin-api-keys/${encodeURIComponent(id)}/rotate`)
    return data
  }

  async revokeAdminApiKey(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/settings/admin-api-keys/${encodeURIComponent(id)}`)
    return data
  }

  async regenerateAdminApiKey(): Promise<unknown> {
    const { data } = await apiClient.post<unknown>('/admin/settings/admin-api-key/regenerate')
    return data
  }

  async deleteAdminApiKey(): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>('/admin/settings/admin-api-key')
    return data
  }

  async updateOverloadCooldownSettings(req: UpdateOverloadCooldownRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>('/admin/settings/overload-cooldown', req)
    return data
  }

  async updateRateLimit429CooldownSettings(req: UpdateRateLimit429CooldownRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>('/admin/settings/rate-limit-429-cooldown', req)
    return data
  }

  async updateGlobalTempUnschedulableSettings(req: UpdateGlobalTempUnschedulableRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>('/admin/settings/temp-unschedulable', req)
    return data
  }

  async updateStreamTimeoutSettings(req: UpdateStreamTimeoutRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>('/admin/settings/stream-timeout', req)
    return data
  }

  async updateRectifierSettings(req: UpdateRectifierRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>('/admin/settings/rectifier', req)
    return data
  }

  async updateBetaPolicySettings(req: UpdateBetaPolicyRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>('/admin/settings/beta-policy', req)
    return data
  }

  async updateWebSearchEmulationConfig(req: UpdateWebSearchEmulationRequest): Promise<unknown> {
    const { data } = await apiClient.put<unknown>('/admin/settings/web-search-emulation', req)
    return data
  }

  async testWebSearchEmulation(query: string, provider?: string): Promise<unknown> {
    const { data } = await apiClient.post<unknown>('/admin/settings/web-search-emulation/test', { query, provider })
    return data
  }

  async resetWebSearchUsage(provider: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/admin/settings/web-search-emulation/reset-usage', { provider })
    return data
  }
}

export const adminSettingsActionDatasource = new AdminSettingsActionDatasource()
