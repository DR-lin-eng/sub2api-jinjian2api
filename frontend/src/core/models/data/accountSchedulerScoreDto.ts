import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AccountSchedulerScore } from '@/core/models/domain/accountSchedulerScore'

export class AccountSchedulerScoreDto {
  @Expose({ name: 'base_score' }) @Transform(({ value }) => value ?? 0) baseScore!: number
  @Expose({ name: 'sticky_score' }) @Transform(({ value }) => value ?? 0) stickyScore!: number
  @Expose({ name: 'sticky_score_infinity' }) @Transform(({ value }) => value ?? false) stickyScoreInfinity!: boolean
  @Expose({ name: 'sticky_weighted_enabled' }) @Transform(({ value }) => value ?? false) stickyWeightedEnabled!: boolean

  static fromJson(json: unknown): AccountSchedulerScoreDto {
    return plainToInstance(AccountSchedulerScoreDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountSchedulerScore {
    const e = new AccountSchedulerScore()
    e.baseScore = this.baseScore
    e.stickyScore = this.stickyScore
    e.stickyScoreInfinity = this.stickyScoreInfinity
    e.stickyWeightedEnabled = this.stickyWeightedEnabled
    return e
  }
}
