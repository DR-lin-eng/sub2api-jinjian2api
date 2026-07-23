import type { DataManagementS3Profile } from '@/features/admin-backup/domain/models/dataManagementS3Profile'

export class ListS3ProfilesResponse {
  items!: DataManagementS3Profile[]
}
