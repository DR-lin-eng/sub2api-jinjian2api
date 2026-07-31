import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptIssueSummary } from '@/features/prompt-audit/domain/models/promptIssueSummary'

export class PromptIssueSummaryDto {
  @Expose() category!: string
  @Expose({ name: 'scanner_id' }) scannerId!: string
  @Expose() @Transform(({ value }) => value ?? '') title!: string
  @Expose() @Transform(({ value }) => value ?? '') description!: string
  @Expose() @Transform(({ value }) => value ?? '') severity!: string
  @Expose({ name: 'severity_label' }) @Transform(({ value }) => value ?? '') severityLabel!: string
  @Expose() @Transform(({ value }) => value ?? '') action!: string
  @Expose({ name: 'action_label' }) @Transform(({ value }) => value ?? '') actionLabel!: string
  @Expose() @Transform(({ value }) => value ?? '') code!: string
  @Expose() @Transform(({ value }) => value ?? 0) score!: number
  @Expose() @Transform(({ value }) => value ?? '') evidence!: string
  @Expose({ name: 'evidence_hash' }) @Transform(({ value }) => value ?? '') evidenceHash!: string
  @Expose({ name: 'start_rune' }) startRune?: number
  @Expose({ name: 'end_rune' }) endRune?: number

  static fromJson(json: unknown): PromptIssueSummaryDto {
    return plainToInstance(PromptIssueSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptIssueSummary {
    const e = new PromptIssueSummary()
    e.category = this.category
    e.scannerId = this.scannerId
    e.title = this.title
    e.description = this.description
    e.severity = this.severity
    e.severityLabel = this.severityLabel
    e.action = this.action
    e.actionLabel = this.actionLabel
    e.code = this.code
    e.score = this.score
    e.evidence = this.evidence
    e.evidenceHash = this.evidenceHash
    e.startRune = this.startRune
    e.endRune = this.endRune
    return e
  }
}
