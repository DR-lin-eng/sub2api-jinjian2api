import { AccountUsageHistory } from '@/features/admin-accounts/domain/models/accountUsageHistory'
import { AccountUsageSummary } from '@/features/admin-accounts/domain/models/accountUsageSummary'
import type { ModelStat } from '@/features/admin-dashboard/domain/models/modelStat'
import type { EndpointStat } from '@/core/models/domain/endpointStat'

export class AccountUsageStatsResponse {
  history!: AccountUsageHistory[]
  summary!: AccountUsageSummary
  models!: ModelStat[]
  endpoints!: EndpointStat[]
  upstreamEndpoints!: EndpointStat[]
}
