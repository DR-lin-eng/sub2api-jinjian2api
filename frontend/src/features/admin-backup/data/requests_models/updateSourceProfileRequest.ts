import type { DataManagementSourceConfigRequest } from '@/features/admin-backup/data/requests_models/dataManagementSourceConfigRequest'

export interface UpdateSourceProfileRequest {
  name: string
  config: DataManagementSourceConfigRequest
}
