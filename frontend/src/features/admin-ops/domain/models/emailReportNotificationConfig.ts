export class EmailReportNotificationConfig {
  enabled!: boolean
  recipients!: string[]
  dailySummaryEnabled!: boolean
  dailySummarySchedule!: string
  weeklySummaryEnabled!: boolean
  weeklySummarySchedule!: string
  errorDigestEnabled!: boolean
  errorDigestSchedule!: string
  errorDigestMinCount!: number
  accountHealthEnabled!: boolean
  accountHealthSchedule!: string
  accountHealthErrorRateThreshold!: number
}
