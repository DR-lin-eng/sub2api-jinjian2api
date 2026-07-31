import type { GrokQuotaProbeResult } from '@/features/admin-accounts/domain/models/grokQuotaProbeResult'

export interface GrokQueryRepository {
  queryQuota(id: number): Promise<GrokQuotaProbeResult>
}
