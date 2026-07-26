import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AccountHourlyUsageStats } from '@/core/models/domain/accountHourlyUsageStats'

export class AccountHourlyUsageStatsDto {
  @Expose({ name: 'total_requests' }) @Transform(({ value }) => value ?? 0) totalRequests!: number
  @Expose({ name: 'successful_requests' }) @Transform(({ value }) => value ?? 0) successfulRequests!: number
  @Expose({ name: 'success_rate' }) @Transform(({ value }) => value ?? 0) successRate!: number
  @Expose({ name: 'avg_first_token_ms' }) @Transform(({ value }) => value ?? 0) avgFirstTokenMs!: number
  @Expose({ name: 'error_4xx' }) @Transform(({ value }) => value ?? 0) error4xx!: number
  @Expose({ name: 'error_5xx' }) @Transform(({ value }) => value ?? 0) error5xx!: number

  static fromJson(json: unknown): AccountHourlyUsageStatsDto {
    return plainToInstance(AccountHourlyUsageStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountHourlyUsageStats {
    const e = new AccountHourlyUsageStats()
    e.totalRequests = this.totalRequests
    e.successfulRequests = this.successfulRequests
    e.successRate = this.successRate
    e.avgFirstTokenMs = this.avgFirstTokenMs
    e.error4xx = this.error4xx
    e.error5xx = this.error5xx
    return e
  }
}
