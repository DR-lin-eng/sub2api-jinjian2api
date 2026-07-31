import type { AdminDashboardTrendRequest } from './adminDashboardTrendRequest'

export interface AdminDashboardSnapshotV2Request extends AdminDashboardTrendRequest {
  include_stats?: boolean
  include_trend?: boolean
  include_model_stats?: boolean
  include_group_stats?: boolean
  include_users_trend?: boolean
  users_trend_limit?: number
  include_user_ranking?: boolean
  user_ranking_limit?: number
}
