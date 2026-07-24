export class MethodLimit {
  dailyLimit!: number
  dailyUsed!: number
  dailyRemaining!: number
  singleMin!: number
  singleMax!: number
  feeRate!: number
  available!: boolean
  currency?: string
  displayName?: string
}
