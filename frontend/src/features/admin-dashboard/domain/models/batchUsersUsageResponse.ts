import type { BatchUserUsageStats } from './batchUserUsageStats'

export class BatchUsersUsageResponse {
  stats!: Record<string, BatchUserUsageStats>
}
