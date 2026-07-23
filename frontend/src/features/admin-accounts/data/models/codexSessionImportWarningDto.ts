import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CodexSessionImportWarning } from '@/features/admin-accounts/domain/models/codexSessionImportWarning'

export class CodexSessionImportWarningDto {
  @Expose() @Transform(({ value }) => value ?? 0) index!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? '') message!: string

  static fromJson(json: unknown): CodexSessionImportWarningDto {
    return plainToInstance(CodexSessionImportWarningDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CodexSessionImportWarning {
    const e = new CodexSessionImportWarning()
    e.index = this.index
    e.name = this.name
    e.message = this.message
    return e
  }
}
