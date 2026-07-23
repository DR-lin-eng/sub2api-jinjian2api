import type { DataManagementPostgresConfig } from '@/features/admin-backup/domain/models/dataManagementPostgresConfig'
import type { DataManagementRedisConfig } from '@/features/admin-backup/domain/models/dataManagementRedisConfig'
import type { DataManagementS3Config } from '@/features/admin-backup/domain/models/dataManagementS3Config'

export class DataManagementConfig {
  sourceMode!: 'direct' | 'docker_exec'
  backupRoot!: string
  sqlitePath!: string
  retentionDays!: number
  keepLast!: number
  activePostgresProfileId!: string
  activeRedisProfileId!: string
  activeS3ProfileId!: string
  postgres!: DataManagementPostgresConfig
  redis!: DataManagementRedisConfig
  s3!: DataManagementS3Config
}
