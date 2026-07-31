export class ScheduledTestPlan {
  id!: number
  accountId!: number
  modelId!: string
  cronExpression!: string
  enabled!: boolean
  maxResults!: number
  autoRecover!: boolean
  lastRunAt!: string
  nextRunAt!: string
  createdAt!: string
  updatedAt!: string
}
