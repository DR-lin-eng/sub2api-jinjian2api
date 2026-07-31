import type { BackupType } from '@/features/admin-backup/enums/backupType'

export interface CreateBackupJobRequest {
  backup_type: BackupType
  upload_to_s3?: boolean
  s3_profile_id?: string
  postgres_profile_id?: string
  redis_profile_id?: string
  idempotency_key?: string
}
