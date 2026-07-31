export class ModelStat {
  model!: string
  requests!: number
  inputTokens!: number
  outputTokens!: number
  cacheCreationTokens!: number
  cacheReadTokens!: number
  totalTokens!: number
  cost!: number
  actualCost!: number
  accountCost?: number
}
