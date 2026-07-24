import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UsageLogAccountSummary } from '@/core/models/domain/usageLogAccountSummary'

export class UsageLogAccountSummaryDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string

  static fromJson(json: unknown): UsageLogAccountSummaryDto {
    return plainToInstance(UsageLogAccountSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UsageLogAccountSummary {
    const e = new UsageLogAccountSummary()
    e.id = this.id
    e.name = this.name
    return e
  }
}
