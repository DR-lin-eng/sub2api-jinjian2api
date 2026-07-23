import { grokQueryDatasource } from '@/features/admin-accounts/data/datasources/grokQueryDatasource'
import type { GrokQuotaProbeResult } from '@/features/admin-accounts/domain/models/grokQuotaProbeResult'
import type { GrokQueryRepository } from '@/features/admin-accounts/domain/repositories/grokQueryRepository'

export class GrokQueryRepositoryImpl implements GrokQueryRepository {
  private readonly ds = grokQueryDatasource

  async queryQuota(id: number): Promise<GrokQuotaProbeResult> {
    return (await this.ds.queryQuota(id)).toEntity()
  }
}

export const grokQueryRepository: GrokQueryRepository = new GrokQueryRepositoryImpl()
