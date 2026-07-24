import { apiClient } from '@/core/networks/client'
import { AlertRuleDto } from '@/features/admin-ops/data/models/alertRuleDto'
import { EmailNotificationConfigDto } from '@/features/admin-ops/data/models/emailNotificationConfigDto'
import { OpsAlertRuntimeSettingsDto } from '@/features/admin-ops/data/models/opsAlertRuntimeSettingsDto'
import { OpsRuntimeLogConfigDto } from '@/features/admin-ops/data/models/opsRuntimeLogConfigDto'
import { OpsAdvancedSettingsDto } from '@/features/admin-ops/data/models/opsAdvancedSettingsDto'
import type { CreateAlertRuleRequest } from '@/features/admin-ops/data/requests_models/createAlertRuleRequest'
import type { UpdateAlertRuleRequest } from '@/features/admin-ops/data/requests_models/updateAlertRuleRequest'
import type { UpdateAlertEventStatusRequest } from '@/features/admin-ops/data/requests_models/updateAlertEventStatusRequest'
import type { CreateAlertSilenceRequest } from '@/features/admin-ops/data/requests_models/createAlertSilenceRequest'
import type { UpdateEmailNotificationConfigRequest } from '@/features/admin-ops/data/requests_models/updateEmailNotificationConfigRequest'
import type { UpdateAlertRuntimeSettingsRequest } from '@/features/admin-ops/data/requests_models/updateAlertRuntimeSettingsRequest'
import type { UpdateRuntimeLogConfigRequest } from '@/features/admin-ops/data/requests_models/updateRuntimeLogConfigRequest'
import type { CleanupSystemLogsRequest } from '@/features/admin-ops/data/requests_models/cleanupSystemLogsRequest'
import type { UpdateAdvancedSettingsRequest } from '@/features/admin-ops/data/requests_models/updateAdvancedSettingsRequest'
import type { UpdateErrorResolvedRequest } from '@/features/admin-ops/data/requests_models/updateErrorResolvedRequest'

export class AdminOpsActionDatasource {
  async updateErrorResolved(errorId: number, req: UpdateErrorResolvedRequest): Promise<void> {
    await apiClient.put(`/admin/ops/errors/${errorId}/resolve`, req)
  }

  async updateRequestErrorResolved(errorId: number, req: UpdateErrorResolvedRequest): Promise<void> {
    await apiClient.put(`/admin/ops/request-errors/${errorId}/resolve`, req)
  }

  async updateUpstreamErrorResolved(errorId: number, req: UpdateErrorResolvedRequest): Promise<void> {
    await apiClient.put(`/admin/ops/upstream-errors/${errorId}/resolve`, req)
  }

  async createAlertRule(req: CreateAlertRuleRequest): Promise<AlertRuleDto> {
    const { data } = await apiClient.post<unknown>('/admin/ops/alert-rules', req)
    return AlertRuleDto.fromJson(data)
  }

  async updateAlertRule(id: number, req: UpdateAlertRuleRequest): Promise<AlertRuleDto> {
    const { data } = await apiClient.put<unknown>(`/admin/ops/alert-rules/${id}`, req)
    return AlertRuleDto.fromJson(data)
  }

  async deleteAlertRule(id: number): Promise<void> {
    await apiClient.delete(`/admin/ops/alert-rules/${id}`)
  }

  async updateAlertEventStatus(id: number, req: UpdateAlertEventStatusRequest): Promise<void> {
    await apiClient.put(`/admin/ops/alert-events/${id}/status`, req)
  }

  async createAlertSilence(req: CreateAlertSilenceRequest): Promise<void> {
    await apiClient.post('/admin/ops/alert-silences', req)
  }

  async updateEmailNotificationConfig(req: UpdateEmailNotificationConfigRequest): Promise<EmailNotificationConfigDto> {
    const { data } = await apiClient.put<unknown>('/admin/ops/email-notification/config', req)
    return EmailNotificationConfigDto.fromJson(data)
  }

  async updateAlertRuntimeSettings(req: UpdateAlertRuntimeSettingsRequest): Promise<OpsAlertRuntimeSettingsDto> {
    const { data } = await apiClient.put<unknown>('/admin/ops/runtime/alert', req)
    return OpsAlertRuntimeSettingsDto.fromJson(data)
  }

  async updateRuntimeLogConfig(req: UpdateRuntimeLogConfigRequest): Promise<OpsRuntimeLogConfigDto> {
    const { data } = await apiClient.put<unknown>('/admin/ops/runtime/logging', req)
    return OpsRuntimeLogConfigDto.fromJson(data)
  }

  async resetRuntimeLogConfig(): Promise<OpsRuntimeLogConfigDto> {
    const { data } = await apiClient.post<unknown>('/admin/ops/runtime/logging/reset')
    return OpsRuntimeLogConfigDto.fromJson(data)
  }

  async cleanupSystemLogs(req: CleanupSystemLogsRequest): Promise<{ deleted: number }> {
    const { data } = await apiClient.post<{ deleted: number }>('/admin/ops/system-logs/cleanup', req)
    return data
  }

  async updateAdvancedSettings(req: UpdateAdvancedSettingsRequest): Promise<OpsAdvancedSettingsDto> {
    const { data } = await apiClient.put<unknown>('/admin/ops/advanced-settings', req)
    return OpsAdvancedSettingsDto.fromJson(data)
  }
}

export const adminOpsActionDatasource = new AdminOpsActionDatasource()
