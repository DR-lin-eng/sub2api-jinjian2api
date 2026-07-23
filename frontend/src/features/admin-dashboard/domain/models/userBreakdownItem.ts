export class UserBreakdownItem {
  userId!: number
  email!: string
  requests!: number
  inputTokens!: number
  outputTokens!: number
  cacheTokens!: number
  totalTokens!: number
  cost!: number
  actualCost!: number
  accountCost!: number
}
