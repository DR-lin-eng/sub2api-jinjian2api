import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { CodexSessionImportResult } from '@/features/admin-accounts/domain/models/codexSessionImportResult'
import { CodexSessionImportItemDto } from '@/features/admin-accounts/data/models/codexSessionImportItemDto'
import { CodexSessionImportWarningDto } from '@/features/admin-accounts/data/models/codexSessionImportWarningDto'
import { CodexSessionImportErrorDto } from '@/features/admin-accounts/data/models/codexSessionImportErrorDto'

export class CodexSessionImportResultDto {
  @Expose() @Transform(({ value }) => value ?? 0) total!: number
  @Expose() @Transform(({ value }) => value ?? 0) created!: number
  @Expose() @Transform(({ value }) => value ?? 0) updated!: number
  @Expose() @Transform(({ value }) => value ?? 0) skipped!: number
  @Expose() @Transform(({ value }) => value ?? 0) failed!: number
  @Expose() @Type(() => CodexSessionImportItemDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) items!: CodexSessionImportItemDto[]
  @Expose() @Type(() => CodexSessionImportWarningDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) warnings!: CodexSessionImportWarningDto[]
  @Expose() @Type(() => CodexSessionImportErrorDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) errors!: CodexSessionImportErrorDto[]

  static fromJson(json: unknown): CodexSessionImportResultDto {
    return plainToInstance(CodexSessionImportResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CodexSessionImportResult {
    const e = new CodexSessionImportResult()
    e.total = this.total
    e.created = this.created
    e.updated = this.updated
    e.skipped = this.skipped
    e.failed = this.failed
    e.items = (this.items ?? []).map(dto => dto.toEntity())
    e.warnings = (this.warnings ?? []).map(dto => dto.toEntity())
    e.errors = (this.errors ?? []).map(dto => dto.toEntity())
    return e
  }
}
