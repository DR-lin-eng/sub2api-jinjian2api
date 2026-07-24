export class RedeemCodeResult {
  message!: string
  type!: string
  value!: number
  newBalance?: number
  newConcurrency?: number
  groupName?: string
  validityDays?: number
}
