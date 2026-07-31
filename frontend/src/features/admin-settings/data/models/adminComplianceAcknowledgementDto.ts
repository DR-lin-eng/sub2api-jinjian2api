import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminComplianceAcknowledgement } from '@/features/admin-settings/domain/models/adminComplianceAcknowledgement'

export class AdminComplianceAcknowledgementDto {
  @Expose() version!: string
  @Expose({ name: 'document_zh' }) @Transform(({ value }) => value ?? '') documentZh!: string
  @Expose({ name: 'document_en' }) @Transform(({ value }) => value ?? '') documentEn!: string
  @Expose({ name: 'admin_user_id' }) @Transform(({ value }) => value ?? 0) adminUserId!: number
  @Expose({ name: 'ip_address' }) @Transform(({ value }) => value ?? '') ipAddress!: string
  @Expose({ name: 'user_agent' }) @Transform(({ value }) => value ?? '') userAgent!: string
  @Expose({ name: 'accepted_at' }) @Transform(({ value }) => value ?? '') acceptedAt!: string

  static fromJson(json: unknown): AdminComplianceAcknowledgementDto {
    return plainToInstance(AdminComplianceAcknowledgementDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminComplianceAcknowledgement {
    const e = new AdminComplianceAcknowledgement()
    e.version = this.version
    e.documentZh = this.documentZh
    e.documentEn = this.documentEn
    e.adminUserId = this.adminUserId
    e.ipAddress = this.ipAddress
    e.userAgent = this.userAgent
    e.acceptedAt = this.acceptedAt
    return e
  }
}
