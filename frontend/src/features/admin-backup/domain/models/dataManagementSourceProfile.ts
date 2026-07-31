import type { DataManagementSourceConfig } from '@/features/admin-backup/domain/models/dataManagementSourceConfig'
import type { SourceType } from '@/features/admin-backup/enums/sourceType'

export class DataManagementSourceProfile {
  sourceType!: SourceType
  profileId!: string
  name!: string
  isActive!: boolean
  passwordConfigured!: boolean
  config!: DataManagementSourceConfig
  createdAt!: string
  updatedAt!: string
}
