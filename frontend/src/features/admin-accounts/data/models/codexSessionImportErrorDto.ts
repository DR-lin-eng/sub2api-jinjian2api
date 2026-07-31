import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CodexSessionImportError } from '@/features/admin-accounts/domain/models/codexSessionImportError'

export class CodexSessionImportErrorDto {
  @Expose() @Transform(({ value }) => value ?? 0) index!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? '') message!: string

  static fromJson(json: unknown): CodexSessionImportErrorDto {
    return plainToInstance(CodexSessionImportErrorDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CodexSessionImportError {
    const e = new CodexSessionImportError()
    e.index = this.index
    e.name = this.name
    e.message = this.message
    return e
  }
}
