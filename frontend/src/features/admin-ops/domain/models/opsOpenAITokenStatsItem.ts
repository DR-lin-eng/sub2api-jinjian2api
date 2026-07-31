export class OpsOpenAITokenStatsItem {
  model!: string
  requestCount!: number
  avgTokensPerSec!: number
  avgFirstTokenMs!: number
  totalOutputTokens!: number
  avgDurationMs!: number
  requestsWithFirstToken!: number
}
