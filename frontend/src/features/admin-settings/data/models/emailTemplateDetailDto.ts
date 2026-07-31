import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { EmailTemplateDetail } from '@/features/admin-settings/domain/models/emailTemplateDetail'

export class EmailTemplateDetailDto {
  @Expose() @Transform(({ value }) => value ?? '') event!: string
  @Expose() @Transform(({ value }) => value ?? '') locale!: string
  @Expose() @Transform(({ value }) => value ?? '') subject!: string
  @Expose() @Transform(({ value }) => value ?? '') html!: string
  @Expose({ name: 'is_custom' }) isCustom?: boolean
  @Expose({ name: 'updated_at' }) updatedAt?: string
  @Expose() placeholders?: string[]

  static fromJson(json: unknown): EmailTemplateDetailDto {
    return plainToInstance(EmailTemplateDetailDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): EmailTemplateDetail {
    const e = new EmailTemplateDetail()
    e.event = this.event
    e.locale = this.locale
    e.subject = this.subject
    e.html = this.html
    e.isCustom = this.isCustom
    e.updatedAt = this.updatedAt
    e.placeholders = this.placeholders
    return e
  }
}
