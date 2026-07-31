import { OpsOpenAITokenStatsItem } from './opsOpenAITokenStatsItem'

export class OpsOpenAITokenStats {
  timeRange!: string
  startTime!: string
  endTime!: string
  platform!: string
  groupId!: number
  items!: OpsOpenAITokenStatsItem[]
  total!: number
  page!: number
  pageSize!: number
  topN!: number
}
