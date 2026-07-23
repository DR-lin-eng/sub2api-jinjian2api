import type { DataManagementSourceConfigRequest } from '@/features/admin-backup/data/requests_models/dataManagementSourceConfigRequest'

export interface CreateSourceProfileRequest {
  profile_id: string
  name: string
  config: DataManagementSourceConfigRequest
  set_active?: boolean
}
