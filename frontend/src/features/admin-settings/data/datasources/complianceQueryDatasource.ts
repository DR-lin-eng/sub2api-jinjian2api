import { apiClient } from '@/core/networks/client'
import { AdminComplianceStatusDto } from '@/features/admin-settings/data/models/adminComplianceStatusDto'

export class ComplianceQueryDatasource {
  async getStatus(): Promise<AdminComplianceStatusDto> {
    const { data } = await apiClient.get<unknown>('/admin/compliance')
    return AdminComplianceStatusDto.fromJson(data)
  }
}

export const complianceQueryDatasource = new ComplianceQueryDatasource()
