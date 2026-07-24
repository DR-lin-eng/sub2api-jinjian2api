export class GroupConcurrencyInfo {
  groupId!: number
  groupName!: string
  platform!: string
  currentInUse!: number
  maxCapacity!: number
  loadPercentage!: number
  waitingInQueue!: number
}
