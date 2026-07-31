import { apiClient } from '@/core/networks/client'
import { AdminComplianceStatusDto } from '@/features/admin-settings/data/models/adminComplianceStatusDto'
import type { AcceptAdminComplianceRequest } from '@/features/admin-settings/data/requests_models/acceptAdminComplianceRequest'

export class ComplianceActionDatasource {
  async accept(req: AcceptAdminComplianceRequest): Promise<AdminComplianceStatusDto> {
    const { data } = await apiClient.post<unknown>('/admin/compliance/accept', req)
    return AdminComplianceStatusDto.fromJson(data)
  }
}

export const complianceActionDatasource = new ComplianceActionDatasource()
