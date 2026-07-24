import { OpsUserUsageStatsItem } from './opsUserUsageStatsItem'

export class OpsUserUsageStats {
  timeRange!: string
  startTime!: string
  endTime!: string
  platform!: string
  groupId!: number
  items!: OpsUserUsageStatsItem[]
  total!: number
  page!: number
  pageSize!: number
  topN!: number
}
