import type { BackupArtifactInfo } from '@/features/admin-backup/domain/models/backupArtifactInfo'
import type { BackupJobStatus } from '@/features/admin-backup/domain/models/backupJobStatus'
import type { BackupS3Info } from '@/features/admin-backup/domain/models/backupS3Info'
import type { BackupType } from '@/features/admin-backup/domain/models/backupType'

export class BackupJob {
  jobId!: string
  backupType!: BackupType
  status!: BackupJobStatus
  triggeredBy!: string
  s3ProfileId!: string
  postgresProfileId!: string
  redisProfileId!: string
  startedAt!: string
  finishedAt!: string
  errorMessage!: string
  artifact?: BackupArtifactInfo
  s3?: BackupS3Info
}
