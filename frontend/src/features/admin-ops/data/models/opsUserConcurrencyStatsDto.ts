import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsUserConcurrencyStats } from '@/features/admin-ops/domain/models/opsUserConcurrencyStats'
import { UserConcurrencyInfo } from '@/features/admin-ops/domain/models/userConcurrencyInfo'

export class UserConcurrencyInfoDto {
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose({ name: 'user_email' }) @Transform(({ value }) => value ?? '') userEmail!: string
  @Expose() @Transform(({ value }) => value ?? '') username!: string
  @Expose({ name: 'current_in_use' }) @Transform(({ value }) => value ?? 0) currentInUse!: number
  @Expose({ name: 'max_capacity' }) @Transform(({ value }) => value ?? 0) maxCapacity!: number
  @Expose({ name: 'load_percentage' }) @Transform(({ value }) => value ?? 0) loadPercentage!: number
  @Expose({ name: 'waiting_in_queue' }) @Transform(({ value }) => value ?? 0) waitingInQueue!: number

  static fromJson(json: unknown): UserConcurrencyInfoDto {
    return plainToInstance(UserConcurrencyInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserConcurrencyInfo {
    const e = new UserConcurrencyInfo()
    e.userId = this.userId
    e.userEmail = this.userEmail
    e.username = this.username
    e.currentInUse = this.currentInUse
    e.maxCapacity = this.maxCapacity
    e.loadPercentage = this.loadPercentage
    e.waitingInQueue = this.waitingInQueue
    return e
  }
}

export class OpsUserConcurrencyStatsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? {}) user!: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? '') timestamp!: string

  static fromJson(json: unknown): OpsUserConcurrencyStatsDto {
    return plainToInstance(OpsUserConcurrencyStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsUserConcurrencyStats {
    const e = new OpsUserConcurrencyStats()
    e.enabled = this.enabled
    e.user = Object.fromEntries(
      Object.entries(this.user ?? {}).map(([k, v]) => [k, UserConcurrencyInfoDto.fromJson(v).toEntity()])
    )
    e.timestamp = this.timestamp
    return e
  }
}
