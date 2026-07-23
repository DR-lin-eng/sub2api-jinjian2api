import type { BackupAgentInfo } from '@/features/admin-backup/domain/models/backupAgentInfo'

export class BackupAgentHealth {
  enabled!: boolean
  reason!: string
  socketPath!: string
  agent?: BackupAgentInfo
}
