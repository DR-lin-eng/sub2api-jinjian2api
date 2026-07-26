import type { BatchUserPlatformUsage } from './batchUserPlatformUsage'

export class BatchUserUsageStats {
  userId!: number
  todayActualCost!: number
  totalActualCost!: number
  byPlatform?: BatchUserPlatformUsage[]
}
