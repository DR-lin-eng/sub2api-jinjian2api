export class OpsUserUsageStatsItem {
  userId!: number
  username!: string
  email!: string
  requestCount!: number
  inputTokens!: number
  outputTokens!: number
  cacheTokens!: number
  totalTokens!: number
  actualCost!: number
  lastRequestAt!: string
}
