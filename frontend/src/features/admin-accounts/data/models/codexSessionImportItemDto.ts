import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CodexSessionImportItem } from '@/features/admin-accounts/domain/models/codexSessionImportItem'

export class CodexSessionImportItemDto {
  @Expose() @Transform(({ value }) => value ?? 0) index!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? 'skipped') action!: 'created' | 'updated' | 'skipped' | 'failed'
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose() @Transform(({ value }) => value ?? '') message!: string

  static fromJson(json: unknown): CodexSessionImportItemDto {
    return plainToInstance(CodexSessionImportItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CodexSessionImportItem {
    const e = new CodexSessionImportItem()
    e.index = this.index
    e.name = this.name
    e.action = this.action
    e.accountId = this.accountId
    e.message = this.message
    return e
  }
}
