import type { DataManagementPostgresConfigRequest } from '@/features/admin-backup/data/requests_models/dataManagementPostgresConfigRequest'
import type { DataManagementRedisConfigRequest } from '@/features/admin-backup/data/requests_models/dataManagementRedisConfigRequest'
import type { DataManagementS3ConfigRequest } from '@/features/admin-backup/data/requests_models/dataManagementS3ConfigRequest'

export interface UpdateDataManagementConfigRequest {
  source_mode: 'direct' | 'docker_exec'
  backup_root: string
  sqlite_path?: string
  retention_days: number
  keep_last: number
  active_postgres_profile_id?: string
  active_redis_profile_id?: string
  active_s3_profile_id?: string
  postgres: DataManagementPostgresConfigRequest
  redis: DataManagementRedisConfigRequest
  s3: DataManagementS3ConfigRequest
}
