import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AccountSchedulerGroupScore } from '@/features/admin-accounts/domain/models/accountSchedulerGroupScore'

export class AccountSchedulerGroupScoreDto {
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'group_name' }) @Transform(({ value }) => value ?? '') groupName!: string
  @Expose({ name: 'group_priority' }) @Transform(({ value }) => value ?? 0) groupPriority!: number
  @Expose({ name: 'base_score' }) @Transform(({ value }) => value ?? 0) baseScore!: number
  @Expose({ name: 'sticky_score' }) @Transform(({ value }) => value ?? 0) stickyScore!: number
  @Expose({ name: 'sticky_score_infinity' }) @Transform(({ value }) => value ?? false) stickyScoreInfinity!: boolean
  @Expose({ name: 'sticky_weighted_enabled' }) @Transform(({ value }) => value ?? false) stickyWeightedEnabled!: boolean

  static fromJson(json: unknown): AccountSchedulerGroupScoreDto {
    return plainToInstance(AccountSchedulerGroupScoreDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountSchedulerGroupScore {
    const e = new AccountSchedulerGroupScore()
    e.groupId = this.groupId
    e.groupName = this.groupName
    e.groupPriority = this.groupPriority
    e.baseScore = this.baseScore
    e.stickyScore = this.stickyScore
    e.stickyScoreInfinity = this.stickyScoreInfinity
    e.stickyWeightedEnabled = this.stickyWeightedEnabled
    return e
  }
}
