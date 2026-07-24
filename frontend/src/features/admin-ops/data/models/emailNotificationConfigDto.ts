import 'reflect-metadata'
import { Expose, Type, plainToInstance } from 'class-transformer'
import { EmailNotificationConfig } from '@/features/admin-ops/domain/models/emailNotificationConfig'
import { EmailAlertNotificationConfigDto } from './emailAlertNotificationConfigDto'
import { EmailReportNotificationConfigDto } from './emailReportNotificationConfigDto'

export class EmailNotificationConfigDto {
  @Expose() @Type(() => EmailAlertNotificationConfigDto) alert!: EmailAlertNotificationConfigDto
  @Expose() @Type(() => EmailReportNotificationConfigDto) report!: EmailReportNotificationConfigDto

  static fromJson(json: unknown): EmailNotificationConfigDto {
    return plainToInstance(EmailNotificationConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): EmailNotificationConfig {
    const e = new EmailNotificationConfig()
    e.alert = this.alert.toEntity()
    e.report = this.report.toEntity()
    return e
  }
}
