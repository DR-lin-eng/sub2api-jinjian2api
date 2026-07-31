export class UserPricingInterval {
  minTokens!: number
  maxTokens!: number | null
  tierLabel!: string
  inputPrice!: number | null
  outputPrice!: number | null
  cacheWritePrice!: number | null
  cacheReadPrice!: number | null
  perRequestPrice!: number | null
}
