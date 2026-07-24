export class PlatformConcurrencyInfo {
  platform!: string
  currentInUse!: number
  maxCapacity!: number
  loadPercentage!: number
  waitingInQueue!: number
}
