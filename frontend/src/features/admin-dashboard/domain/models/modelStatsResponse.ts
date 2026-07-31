import type { ModelStat } from './modelStat'

export class ModelStatsResponse {
  models!: ModelStat[]
  startDate!: string
  endDate!: string
}
