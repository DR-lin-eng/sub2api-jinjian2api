import type { UserBreakdownItem } from './userBreakdownItem'

export class UserBreakdownResponse {
  users!: UserBreakdownItem[]
  startDate!: string
  endDate!: string
}
