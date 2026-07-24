import type { UsageTrendParams } from './usageTrendParams'

export interface UsageDashboardSnapshotV2Params extends UsageTrendParams {
  include_trend?: boolean
  include_model_stats?: boolean
  include_group_stats?: boolean
}
