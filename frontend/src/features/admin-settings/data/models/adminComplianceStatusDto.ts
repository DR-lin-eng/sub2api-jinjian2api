import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AdminComplianceStatus } from '@/features/admin-settings/domain/models/adminComplianceStatus'
import { AdminComplianceAcknowledgementDto } from '@/features/admin-settings/data/models/adminComplianceAcknowledgementDto'

export class AdminComplianceStatusDto {
  @Expose() @Transform(({ value }) => value ?? false) required!: boolean
  @Expose() @Transform(({ value }) => value ?? '') version!: string
  @Expose({ name: 'document_path_zh' }) @Transform(({ value }) => value ?? '') documentPathZh!: string
  @Expose({ name: 'document_path_en' }) @Transform(({ value }) => value ?? '') documentPathEn!: string
  @Expose({ name: 'document_url_zh' }) @Transform(({ value }) => value ?? '') documentUrlZh!: string
  @Expose({ name: 'document_url_en' }) @Transform(({ value }) => value ?? '') documentUrlEn!: string
  @Expose({ name: 'ack_phrase_zh' }) @Transform(({ value }) => value ?? '') ackPhraseZh!: string
  @Expose({ name: 'ack_phrase_en' }) @Transform(({ value }) => value ?? '') ackPhraseEn!: string

  @Expose()
  @Type(() => AdminComplianceAcknowledgementDto)
  acknowledgement?: AdminComplianceAcknowledgementDto

  static fromJson(json: unknown): AdminComplianceStatusDto {
    return plainToInstance(AdminComplianceStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminComplianceStatus {
    const e = new AdminComplianceStatus()
    e.required = this.required
    e.version = this.version
    e.documentPathZh = this.documentPathZh
    e.documentPathEn = this.documentPathEn
    e.documentUrlZh = this.documentUrlZh
    e.documentUrlEn = this.documentUrlEn
    e.ackPhraseZh = this.ackPhraseZh
    e.ackPhraseEn = this.ackPhraseEn
    e.acknowledgement = this.acknowledgement ? this.acknowledgement.toEntity() : undefined
    return e
  }
}
