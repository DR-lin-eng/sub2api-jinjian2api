export class BackupScheduleConfig {
  enabled!: boolean
  cronExpr!: string
  retainDays!: number
  retainCount!: number
}
