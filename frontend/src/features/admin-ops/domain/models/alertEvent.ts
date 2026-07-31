export class AlertEvent {
  id!: number
  ruleId!: number
  severity!: string
  status!: string
  title!: string
  description!: string
  metricValue!: number
  thresholdValue!: number
  dimensions!: Record<string, unknown>
  firedAt!: string
  resolvedAt!: string
  emailSent!: boolean
  createdAt!: string
}
