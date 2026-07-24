import type { UpdateResult } from '@/features/admin-settings/domain/models/updateResult'

export interface SystemActionRepository {
  performUpdate(): Promise<UpdateResult>
  rollback(version?: string): Promise<UpdateResult>
  restartService(): Promise<{ message: string }>
}
