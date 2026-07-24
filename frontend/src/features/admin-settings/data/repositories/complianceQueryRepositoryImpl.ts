import { complianceQueryDatasource } from '@/features/admin-settings/data/datasources/complianceQueryDatasource'
import type { ComplianceQueryRepository } from '@/features/admin-settings/domain/repositories/complianceQueryRepository'
import type { AdminComplianceStatus } from '@/features/admin-settings/domain/models/adminComplianceStatus'

class ComplianceQueryRepositoryImpl implements ComplianceQueryRepository {
  private readonly ds = complianceQueryDatasource

  async getStatus(): Promise<AdminComplianceStatus> {
    return (await this.ds.getStatus()).toEntity()
  }
}

export const complianceQueryRepository: ComplianceQueryRepository = new ComplianceQueryRepositoryImpl()
