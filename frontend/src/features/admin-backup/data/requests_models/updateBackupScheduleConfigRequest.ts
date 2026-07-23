export interface UpdateBackupScheduleConfigRequest {
  enabled: boolean
  cron_expr: string
  retain_days: number
  retain_count: number
}
