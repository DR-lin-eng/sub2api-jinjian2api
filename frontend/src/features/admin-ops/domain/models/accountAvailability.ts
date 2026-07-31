export class AccountAvailability {
  accountId!: number
  accountName!: string
  platform!: string
  groupId!: number
  groupName!: string
  status!: string
  isAvailable!: boolean
  isRateLimited!: boolean
  rateLimitResetAt!: string
  rateLimitRemainingSec!: number
  isOverloaded!: boolean
  overloadUntil!: string
  overloadRemainingSec!: number
  hasError!: boolean
  errorMessage!: string
}
