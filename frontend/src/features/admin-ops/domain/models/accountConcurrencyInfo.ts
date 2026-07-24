export class AccountConcurrencyInfo {
  accountId!: number
  accountName!: string
  platform!: string
  groupId!: number
  groupName!: string
  currentInUse!: number
  maxCapacity!: number
  loadPercentage!: number
  waitingInQueue!: number
}
