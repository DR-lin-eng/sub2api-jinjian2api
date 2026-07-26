import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsAccountAvailabilityStats } from '@/features/admin-ops/domain/models/opsAccountAvailabilityStats'
import { PlatformAvailability } from '@/features/admin-ops/domain/models/platformAvailability'
import { GroupAvailability } from '@/features/admin-ops/domain/models/groupAvailability'
import { AccountAvailability } from '@/features/admin-ops/domain/models/accountAvailability'

export class PlatformAvailabilityDto {
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'total_accounts' }) @Transform(({ value }) => value ?? 0) totalAccounts!: number
  @Expose({ name: 'available_count' }) @Transform(({ value }) => value ?? 0) availableCount!: number
  @Expose({ name: 'rate_limit_count' }) @Transform(({ value }) => value ?? 0) rateLimitCount!: number
  @Expose({ name: 'error_count' }) @Transform(({ value }) => value ?? 0) errorCount!: number

  static fromJson(json: unknown): PlatformAvailabilityDto {
    return plainToInstance(PlatformAvailabilityDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PlatformAvailability {
    const e = new PlatformAvailability()
    e.platform = this.platform
    e.totalAccounts = this.totalAccounts
    e.availableCount = this.availableCount
    e.rateLimitCount = this.rateLimitCount
    e.errorCount = this.errorCount
    return e
  }
}

export class GroupAvailabilityDto {
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'group_name' }) @Transform(({ value }) => value ?? '') groupName!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'total_accounts' }) @Transform(({ value }) => value ?? 0) totalAccounts!: number
  @Expose({ name: 'available_count' }) @Transform(({ value }) => value ?? 0) availableCount!: number
  @Expose({ name: 'rate_limit_count' }) @Transform(({ value }) => value ?? 0) rateLimitCount!: number
  @Expose({ name: 'error_count' }) @Transform(({ value }) => value ?? 0) errorCount!: number

  static fromJson(json: unknown): GroupAvailabilityDto {
    return plainToInstance(GroupAvailabilityDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GroupAvailability {
    const e = new GroupAvailability()
    e.groupId = this.groupId
    e.groupName = this.groupName
    e.platform = this.platform
    e.totalAccounts = this.totalAccounts
    e.availableCount = this.availableCount
    e.rateLimitCount = this.rateLimitCount
    e.errorCount = this.errorCount
    return e
  }
}

export class AccountAvailabilityDto {
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose({ name: 'account_name' }) @Transform(({ value }) => value ?? '') accountName!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'group_name' }) @Transform(({ value }) => value ?? '') groupName!: string
  @Expose() @Transform(({ value }) => value ?? '') status!: string
  @Expose({ name: 'is_available' }) @Transform(({ value }) => value ?? false) isAvailable!: boolean
  @Expose({ name: 'is_rate_limited' }) @Transform(({ value }) => value ?? false) isRateLimited!: boolean
  @Expose({ name: 'rate_limit_reset_at' }) @Transform(({ value }) => value ?? '') rateLimitResetAt!: string
  @Expose({ name: 'rate_limit_remaining_sec' }) @Transform(({ value }) => value ?? 0) rateLimitRemainingSec!: number
  @Expose({ name: 'is_overloaded' }) @Transform(({ value }) => value ?? false) isOverloaded!: boolean
  @Expose({ name: 'overload_until' }) @Transform(({ value }) => value ?? '') overloadUntil!: string
  @Expose({ name: 'overload_remaining_sec' }) @Transform(({ value }) => value ?? 0) overloadRemainingSec!: number
  @Expose({ name: 'has_error' }) @Transform(({ value }) => value ?? false) hasError!: boolean
  @Expose({ name: 'error_message' }) @Transform(({ value }) => value ?? '') errorMessage!: string

  static fromJson(json: unknown): AccountAvailabilityDto {
    return plainToInstance(AccountAvailabilityDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountAvailability {
    const e = new AccountAvailability()
    e.accountId = this.accountId
    e.accountName = this.accountName
    e.platform = this.platform
    e.groupId = this.groupId
    e.groupName = this.groupName
    e.status = this.status
    e.isAvailable = this.isAvailable
    e.isRateLimited = this.isRateLimited
    e.rateLimitResetAt = this.rateLimitResetAt
    e.rateLimitRemainingSec = this.rateLimitRemainingSec
    e.isOverloaded = this.isOverloaded
    e.overloadUntil = this.overloadUntil
    e.overloadRemainingSec = this.overloadRemainingSec
    e.hasError = this.hasError
    e.errorMessage = this.errorMessage
    return e
  }
}

export class OpsAccountAvailabilityStatsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? {}) platform!: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? {}) group!: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? {}) account!: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? '') timestamp!: string

  static fromJson(json: unknown): OpsAccountAvailabilityStatsDto {
    return plainToInstance(OpsAccountAvailabilityStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsAccountAvailabilityStats {
    const e = new OpsAccountAvailabilityStats()
    e.enabled = this.enabled
    e.platform = Object.fromEntries(
      Object.entries(this.platform ?? {}).map(([k, v]) => [k, PlatformAvailabilityDto.fromJson(v).toEntity()])
    )
    e.group = Object.fromEntries(
      Object.entries(this.group ?? {}).map(([k, v]) => [k, GroupAvailabilityDto.fromJson(v).toEntity()])
    )
    e.account = Object.fromEntries(
      Object.entries(this.account ?? {}).map(([k, v]) => [k, AccountAvailabilityDto.fromJson(v).toEntity()])
    )
    e.timestamp = this.timestamp
    return e
  }
}
