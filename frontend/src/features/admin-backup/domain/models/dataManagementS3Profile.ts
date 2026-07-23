import type { DataManagementS3Config } from '@/features/admin-backup/domain/models/dataManagementS3Config'

export class DataManagementS3Profile {
  profileId!: string
  name!: string
  isActive!: boolean
  s3!: DataManagementS3Config
  secretAccessKeyConfigured!: boolean
  createdAt!: string
  updatedAt!: string
}
