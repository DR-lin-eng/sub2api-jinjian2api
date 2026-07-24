import { complianceActionDatasource } from '@/features/admin-settings/data/datasources/complianceActionDatasource'
import type { ComplianceActionRepository } from '@/features/admin-settings/domain/repositories/complianceActionRepository'
import type { AdminComplianceStatus } from '@/features/admin-settings/domain/models/adminComplianceStatus'
import type { AcceptAdminComplianceRequest } from '@/features/admin-settings/data/requests_models/acceptAdminComplianceRequest'

class ComplianceActionRepositoryImpl implements ComplianceActionRepository {
  private readonly ds = complianceActionDatasource

  async accept(req: AcceptAdminComplianceRequest): Promise<AdminComplianceStatus> {
    return (await this.ds.accept(req)).toEntity()
  }
}

export const complianceActionRepository: ComplianceActionRepository = new ComplianceActionRepositoryImpl()
