import type { MetricType, Operator } from '@/features/admin-ops/enums/alertEnums'

export class AlertRule {
  id!: number
  name!: string
  description!: string
  enabled!: boolean
  metricType!: MetricType
  operator!: Operator
  threshold!: number
  windowMinutes!: number
  sustainedMinutes!: number
  severity!: string
  cooldownMinutes!: number
  notifyEmail!: boolean
  filters!: Record<string, unknown>
  createdAt!: string
  updatedAt!: string
  lastTriggeredAt!: string
}
