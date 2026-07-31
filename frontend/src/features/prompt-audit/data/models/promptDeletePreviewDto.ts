import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'

export class PromptDeletePreviewDto {
  @Expose({ name: 'matched_count' }) @Transform(({ value }) => value ?? 0) matchedCount!: number
  @Expose({ name: 'filter_summary' }) @Transform(({ value }) => value ?? {}) filterSummary!: Record<string, unknown>
  @Expose({ name: 'snapshot_max_id' }) @Transform(({ value }) => value ?? 0) snapshotMaxId!: number
  @Expose({ name: 'filter_hash' }) @Transform(({ value }) => value ?? '') filterHash!: string
  @Expose({ name: 'confirmation_token' }) @Transform(({ value }) => value ?? '') confirmationToken!: string
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? '') expiresAt!: string

  static fromJson(json: unknown): PromptDeletePreviewDto {
    return plainToInstance(PromptDeletePreviewDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptDeletePreview {
    const e = new PromptDeletePreview()
    e.matchedCount = this.matchedCount
    e.filterSummary = this.filterSummary
    e.snapshotMaxId = this.snapshotMaxId
    e.filterHash = this.filterHash
    e.confirmationToken = this.confirmationToken
    e.expiresAt = this.expiresAt
    return e
  }
}
