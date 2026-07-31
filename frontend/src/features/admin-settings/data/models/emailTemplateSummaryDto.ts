import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { EmailTemplateSummary } from '@/features/admin-settings/domain/models/emailTemplateSummary'

export class EmailTemplateSummaryDto {
  @Expose() @Transform(({ value }) => value ?? '') event!: string
  @Expose() @Transform(({ value }) => value ?? '') locale!: string
  @Expose() @Transform(({ value }) => value ?? '') subject!: string
  @Expose({ name: 'is_custom' }) isCustom?: boolean
  @Expose({ name: 'updated_at' }) updatedAt?: string

  static fromJson(json: unknown): EmailTemplateSummaryDto {
    return plainToInstance(EmailTemplateSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): EmailTemplateSummary {
    const e = new EmailTemplateSummary()
    e.event = this.event
    e.locale = this.locale
    e.subject = this.subject
    e.isCustom = this.isCustom
    e.updatedAt = this.updatedAt
    return e
  }
}
