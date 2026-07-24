import type { TrendDataPoint } from '@/features/admin-dashboard/domain/models/trendDataPoint'
import type { ModelStat } from '@/features/admin-dashboard/domain/models/modelStat'
import type { GroupStat } from '@/features/admin-dashboard/domain/models/groupStat'

export class UsageDashboardSnapshotV2Response {
  generatedAt!: string
  startDate!: string
  endDate!: string
  granularity!: string
  trend?: TrendDataPoint[]
  models?: ModelStat[]
  groups?: GroupStat[]
}
