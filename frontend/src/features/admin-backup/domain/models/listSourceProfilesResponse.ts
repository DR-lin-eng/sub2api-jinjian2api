import type { DataManagementSourceProfile } from '@/features/admin-backup/domain/models/dataManagementSourceProfile'

export class ListSourceProfilesResponse {
  items!: DataManagementSourceProfile[]
}
