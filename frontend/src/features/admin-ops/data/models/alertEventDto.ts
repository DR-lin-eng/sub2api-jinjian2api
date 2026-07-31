import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AlertEvent } from '@/features/admin-ops/domain/models/alertEvent'

export class AlertEventDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose({ name: 'rule_id' }) @Transform(({ value }) => value ?? 0) ruleId!: number
  @Expose() @Transform(({ value }) => value ?? '') severity!: string
  @Expose() @Transform(({ value }) => value ?? '') status!: string
  @Expose() @Transform(({ value }) => value ?? '') title!: string
  @Expose() @Transform(({ value }) => value ?? '') description!: string
  @Expose({ name: 'metric_value' }) @Transform(({ value }) => value ?? 0) metricValue!: number
  @Expose({ name: 'threshold_value' }) @Transform(({ value }) => value ?? 0) thresholdValue!: number
  @Expose() @Transform(({ value }) => value ?? {}) dimensions!: Record<string, unknown>
  @Expose({ name: 'fired_at' }) @Transform(({ value }) => value ?? '') firedAt!: string
  @Expose({ name: 'resolved_at' }) @Transform(({ value }) => value ?? '') resolvedAt!: string
  @Expose({ name: 'email_sent' }) @Transform(({ value }) => value ?? false) emailSent!: boolean
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string

  static fromJson(json: unknown): AlertEventDto {
    return plainToInstance(AlertEventDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AlertEvent {
    const e = new AlertEvent()
    e.id = this.id
    e.ruleId = this.ruleId
    e.severity = this.severity
    e.status = this.status
    e.title = this.title
    e.description = this.description
    e.metricValue = this.metricValue
    e.thresholdValue = this.thresholdValue
    e.dimensions = this.dimensions
    e.firedAt = this.firedAt
    e.resolvedAt = this.resolvedAt
    e.emailSent = this.emailSent
    e.createdAt = this.createdAt
    return e
  }
}
