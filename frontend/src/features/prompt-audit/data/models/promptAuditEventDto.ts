import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { PromptAuditEvent } from '@/features/prompt-audit/domain/models/promptAuditEvent'
import { PromptSnapshotDto } from './promptSnapshotDto'
import { PromptIssueSummaryDto } from './promptIssueSummaryDto'

export class PromptAuditEventDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose({ name: 'job_id' }) @Transform(({ value }) => value ?? 0) jobId!: number
  @Expose() @Type(() => PromptSnapshotDto) snapshot!: PromptSnapshotDto
  @Expose() @Transform(({ value }) => value ?? 'pass') decision!: string
  @Expose({ name: 'risk_level' }) @Transform(({ value }) => value ?? 'low') riskLevel!: string
  @Expose() @Transform(({ value }) => value ?? 'Allow') action!: string
  @Expose() @Transform(({ value }) => value ?? []) categories!: string[]
  @Expose({ name: 'matched_scanners' }) @Transform(({ value }) => value ?? []) matchedScanners!: string[]
  @Expose({ name: 'scanner_scores' }) @Transform(({ value }) => value ?? {}) scannerScores!: Record<string, number>
  @Expose({ name: 'scanner_evidence' }) @Transform(({ value }) => value ?? {}) scannerEvidence!: Record<string, string>
  @Expose({ name: 'scanner_backend' }) @Transform(({ value }) => value ?? '') scannerBackend!: string
  @Expose({ name: 'scanner_version' }) @Transform(({ value }) => value ?? '') scannerVersion!: string
  @Expose({ name: 'guard_endpoint_id' }) @Transform(({ value }) => value ?? '') guardEndpointId!: string
  @Expose({ name: 'policy_id' }) @Transform(({ value }) => value ?? '') policyId!: string
  @Expose({ name: 'policy_version' }) @Transform(({ value }) => value ?? 0) policyVersion!: number
  @Expose({ name: 'config_version' }) @Transform(({ value }) => value ?? 0) configVersion!: number
  @Expose({ name: 'chunk_total' }) @Transform(({ value }) => value ?? 0) chunkTotal!: number
  @Expose({ name: 'latency_ms' }) @Transform(({ value }) => value ?? 0) latencyMs!: number
  @Expose({ name: 'issue_summaries' }) @Type(() => PromptIssueSummaryDto) @Transform(({ value }) => value ?? []) issueSummaries!: PromptIssueSummaryDto[]
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string

  static fromJson(json: unknown): PromptAuditEventDto {
    return plainToInstance(PromptAuditEventDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptAuditEvent {
    const e = new PromptAuditEvent()
    e.id = this.id
    e.jobId = this.jobId
    e.snapshot = this.snapshot.toEntity()
    e.decision = this.decision as PromptAuditEvent['decision']
    e.riskLevel = this.riskLevel as PromptAuditEvent['riskLevel']
    e.action = this.action
    e.categories = this.categories
    e.matchedScanners = this.matchedScanners
    e.scannerScores = this.scannerScores
    e.scannerEvidence = this.scannerEvidence
    e.scannerBackend = this.scannerBackend
    e.scannerVersion = this.scannerVersion
    e.guardEndpointId = this.guardEndpointId
    e.policyId = this.policyId
    e.policyVersion = this.policyVersion
    e.configVersion = this.configVersion
    e.chunkTotal = this.chunkTotal
    e.latencyMs = this.latencyMs
    e.issueSummaries = this.issueSummaries.map((item) => item.toEntity())
    e.createdAt = this.createdAt
    return e
  }
}
