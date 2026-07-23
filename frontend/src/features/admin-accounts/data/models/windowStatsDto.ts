import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { WindowStats } from '@/features/admin-accounts/domain/models/windowStats'

export class WindowStatsDto {
  @Expose() @Transform(({ value }) => value ?? 0) requests!: number
  @Expose() @Transform(({ value }) => value ?? 0) tokens!: number
  @Expose() @Transform(({ value }) => value ?? 0) cost!: number
  @Expose({ name: 'standard_cost' }) @Transform(({ value }) => value ?? 0) standardCost!: number
  @Expose({ name: 'user_cost' }) @Transform(({ value }) => value ?? 0) userCost!: number

  static fromJson(json: unknown): WindowStatsDto {
    return plainToInstance(WindowStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): WindowStats {
    const e = new WindowStats()
    e.requests = this.requests
    e.tokens = this.tokens
    e.cost = this.cost
    e.standardCost = this.standardCost
    e.userCost = this.userCost
    return e
  }
}
