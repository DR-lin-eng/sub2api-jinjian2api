import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TempUnschedulableState } from '@/features/admin-accounts/domain/models/tempUnschedulableState'

export class TempUnschedulableStateDto {
  @Expose({ name: 'until_unix' }) @Transform(({ value }) => value ?? 0) untilUnix!: number
  @Expose({ name: 'triggered_at_unix' }) @Transform(({ value }) => value ?? 0) triggeredAtUnix!: number
  @Expose({ name: 'status_code' }) @Transform(({ value }) => value ?? 0) statusCode!: number
  @Expose({ name: 'matched_keyword' }) @Transform(({ value }) => value ?? '') matchedKeyword!: string
  @Expose({ name: 'rule_index' }) @Transform(({ value }) => value ?? 0) ruleIndex!: number
  @Expose({ name: 'error_message' }) @Transform(({ value }) => value ?? '') errorMessage!: string

  static fromJson(json: unknown): TempUnschedulableStateDto {
    return plainToInstance(TempUnschedulableStateDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TempUnschedulableState {
    const e = new TempUnschedulableState()
    e.untilUnix = this.untilUnix
    e.triggeredAtUnix = this.triggeredAtUnix
    e.statusCode = this.statusCode
    e.matchedKeyword = this.matchedKeyword
    e.ruleIndex = this.ruleIndex
    e.errorMessage = this.errorMessage
    return e
  }
}
