import { adminOpsActionDatasource } from '@/features/admin-ops/data/datasources/adminOpsActionDatasource'
import type { AdminOpsActionRepository } from '@/features/admin-ops/domain/repositories/adminOpsActionRepository'
import type { AlertRule } from '@/features/admin-ops/domain/models/alertRule'
import type { EmailNotificationConfig } from '@/features/admin-ops/domain/models/emailNotificationConfig'
import type { OpsAlertRuntimeSettings } from '@/features/admin-ops/domain/models/opsAlertRuntimeSettings'
import type { OpsRuntimeLogConfig } from '@/features/admin-ops/domain/models/opsRuntimeLogConfig'
import type { OpsAdvancedSettings } from '@/features/admin-ops/domain/models/opsAdvancedSettings'
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

export class AdminOpsActionRepositoryImpl implements AdminOpsActionRepository {
  private readonly ds = adminOpsActionDatasource

  updateErrorResolved = async (errorId: number, req: UpdateErrorResolvedRequest) : Promise<void>  => {
    return this.ds.updateErrorResolved(errorId, req)
  }

  updateRequestErrorResolved = async (errorId: number, req: UpdateErrorResolvedRequest) : Promise<void>  => {
    return this.ds.updateRequestErrorResolved(errorId, req)
  }

  updateUpstreamErrorResolved = async (errorId: number, req: UpdateErrorResolvedRequest) : Promise<void>  => {
    return this.ds.updateUpstreamErrorResolved(errorId, req)
  }

  createAlertRule = async (req: CreateAlertRuleRequest) : Promise<AlertRule>  => {
    return (await this.ds.createAlertRule(req)).toEntity()
  }

  updateAlertRule = async (id: number, req: UpdateAlertRuleRequest) : Promise<AlertRule>  => {
    return (await this.ds.updateAlertRule(id, req)).toEntity()
  }

  deleteAlertRule = async (id: number) : Promise<void>  => {
    return this.ds.deleteAlertRule(id)
  }

  updateAlertEventStatus = async (id: number, req: UpdateAlertEventStatusRequest) : Promise<void>  => {
    return this.ds.updateAlertEventStatus(id, req)
  }

  createAlertSilence = async (req: CreateAlertSilenceRequest) : Promise<void>  => {
    return this.ds.createAlertSilence(req)
  }

  updateEmailNotificationConfig = async (req: UpdateEmailNotificationConfigRequest) : Promise<EmailNotificationConfig>  => {
    return (await this.ds.updateEmailNotificationConfig(req)).toEntity()
  }

  updateAlertRuntimeSettings = async (req: UpdateAlertRuntimeSettingsRequest) : Promise<OpsAlertRuntimeSettings>  => {
    return (await this.ds.updateAlertRuntimeSettings(req)).toEntity()
  }

  updateRuntimeLogConfig = async (req: UpdateRuntimeLogConfigRequest) : Promise<OpsRuntimeLogConfig>  => {
    return (await this.ds.updateRuntimeLogConfig(req)).toEntity()
  }

  resetRuntimeLogConfig = async () : Promise<OpsRuntimeLogConfig>  => {
    return (await this.ds.resetRuntimeLogConfig()).toEntity()
  }

  cleanupSystemLogs = async (req: CleanupSystemLogsRequest) : Promise<{ deleted: number }>  => {
    return this.ds.cleanupSystemLogs(req)
  }

  updateAdvancedSettings = async (req: UpdateAdvancedSettingsRequest) : Promise<OpsAdvancedSettings>  => {
    return (await this.ds.updateAdvancedSettings(req)).toEntity()
  }
}

export const adminOpsActionRepository: AdminOpsActionRepository = new AdminOpsActionRepositoryImpl()
