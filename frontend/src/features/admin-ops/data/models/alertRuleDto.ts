import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AlertRule } from '@/features/admin-ops/domain/models/alertRule'

export class AlertRuleDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? '') description!: string
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'metric_type' }) @Transform(({ value }) => value ?? '') metricType!: string
  @Expose() @Transform(({ value }) => value ?? '>') operator!: string
  @Expose() @Transform(({ value }) => value ?? 0) threshold!: number
  @Expose({ name: 'window_minutes' }) @Transform(({ value }) => value ?? 0) windowMinutes!: number
  @Expose({ name: 'sustained_minutes' }) @Transform(({ value }) => value ?? 0) sustainedMinutes!: number
  @Expose() @Transform(({ value }) => value ?? '') severity!: string
  @Expose({ name: 'cooldown_minutes' }) @Transform(({ value }) => value ?? 0) cooldownMinutes!: number
  @Expose({ name: 'notify_email' }) @Transform(({ value }) => value ?? false) notifyEmail!: boolean
  @Expose() @Transform(({ value }) => value ?? {}) filters!: Record<string, unknown>
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string
  @Expose({ name: 'last_triggered_at' }) @Transform(({ value }) => value ?? '') lastTriggeredAt!: string

  static fromJson(json: unknown): AlertRuleDto {
    return plainToInstance(AlertRuleDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AlertRule {
    const e = new AlertRule()
    e.id = this.id
    e.name = this.name
    e.description = this.description
    e.enabled = this.enabled
    e.metricType = this.metricType as AlertRule['metricType']
    e.operator = this.operator as AlertRule['operator']
    e.threshold = this.threshold
    e.windowMinutes = this.windowMinutes
    e.sustainedMinutes = this.sustainedMinutes
    e.severity = this.severity
    e.cooldownMinutes = this.cooldownMinutes
    e.notifyEmail = this.notifyEmail
    e.filters = this.filters
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    e.lastTriggeredAt = this.lastTriggeredAt
    return e
  }
}
