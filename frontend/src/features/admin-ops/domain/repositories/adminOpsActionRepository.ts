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

export interface AdminOpsActionRepository {
  updateErrorResolved(errorId: number, req: UpdateErrorResolvedRequest): Promise<void>
  updateRequestErrorResolved(errorId: number, req: UpdateErrorResolvedRequest): Promise<void>
  updateUpstreamErrorResolved(errorId: number, req: UpdateErrorResolvedRequest): Promise<void>
  createAlertRule(req: CreateAlertRuleRequest): Promise<AlertRule>
  updateAlertRule(id: number, req: UpdateAlertRuleRequest): Promise<AlertRule>
  deleteAlertRule(id: number): Promise<void>
  updateAlertEventStatus(id: number, req: UpdateAlertEventStatusRequest): Promise<void>
  createAlertSilence(req: CreateAlertSilenceRequest): Promise<void>
  updateEmailNotificationConfig(req: UpdateEmailNotificationConfigRequest): Promise<EmailNotificationConfig>
  updateAlertRuntimeSettings(req: UpdateAlertRuntimeSettingsRequest): Promise<OpsAlertRuntimeSettings>
  updateRuntimeLogConfig(req: UpdateRuntimeLogConfigRequest): Promise<OpsRuntimeLogConfig>
  resetRuntimeLogConfig(): Promise<OpsRuntimeLogConfig>
  cleanupSystemLogs(req: CleanupSystemLogsRequest): Promise<{ deleted: number }>
  updateAdvancedSettings(req: UpdateAdvancedSettingsRequest): Promise<OpsAdvancedSettings>
}
