export class UserConcurrencyInfo {
  userId!: number
  userEmail!: string
  username!: string
  currentInUse!: number
  maxCapacity!: number
  loadPercentage!: number
  waitingInQueue!: number
}
