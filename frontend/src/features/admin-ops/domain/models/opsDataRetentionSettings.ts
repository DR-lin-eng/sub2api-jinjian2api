export class OpsDataRetentionSettings {
  userRequestLogRetentionDays!: number
  cleanupEnabled!: boolean
  cleanupSchedule!: string
  errorLogRetentionDays!: number
  minuteMetricsRetentionDays!: number
  hourlyMetricsRetentionDays!: number
}
