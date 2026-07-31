// Per-platform usage breakdown embedded in BatchUserUsageStats.
// 与后端 usagestats.PlatformUsage 对应（platform + today/total actual cost）。
export class BatchUserPlatformUsage {
  platform!: string
  todayActualCost!: number
  totalActualCost!: number
}
