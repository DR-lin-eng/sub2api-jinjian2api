import type { VersionInfo } from '@/features/admin-settings/domain/models/versionInfo'
import type { RollbackVersionInfo } from '@/features/admin-settings/domain/models/rollbackVersionInfo'

export interface SystemQueryRepository {
  getVersion(): Promise<{ version: string }>
  checkUpdates(force?: boolean): Promise<VersionInfo>
  getRollbackVersions(): Promise<RollbackVersionInfo[]>
}
