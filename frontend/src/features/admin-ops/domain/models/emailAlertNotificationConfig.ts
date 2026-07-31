export class EmailAlertNotificationConfig {
  enabled!: boolean
  recipients!: string[]
  minSeverity!: string
  rateLimitPerHour!: number
  batchingWindowSeconds!: number
  includeResolvedAlerts!: boolean
}
