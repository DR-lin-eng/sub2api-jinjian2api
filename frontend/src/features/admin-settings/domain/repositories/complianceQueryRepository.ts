import type { AdminComplianceStatus } from '@/features/admin-settings/domain/models/adminComplianceStatus'

export interface ComplianceQueryRepository {
  getStatus(): Promise<AdminComplianceStatus>
}
