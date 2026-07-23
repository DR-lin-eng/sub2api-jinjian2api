import type { GroupStat } from './groupStat'

export class GroupStatsResponse {
  groups!: GroupStat[]
  startDate!: string
  endDate!: string
}
