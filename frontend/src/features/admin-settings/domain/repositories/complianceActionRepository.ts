import type { AdminComplianceStatus } from '@/features/admin-settings/domain/models/adminComplianceStatus'
import type { AcceptAdminComplianceRequest } from '@/features/admin-settings/data/requests_models/acceptAdminComplianceRequest'

export interface ComplianceActionRepository {
  accept(req: AcceptAdminComplianceRequest): Promise<AdminComplianceStatus>
}
