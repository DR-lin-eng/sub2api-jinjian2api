import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { PlatformConcurrencyInfo, GroupConcurrencyInfo, AccountConcurrencyInfo, OpsConcurrencyStats } from '@/features/admin-ops/domain/models/opsConcurrencyStats'

export class PlatformConcurrencyInfoDto {
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'current_in_use' }) @Transform(({ value }) => value ?? 0) currentInUse!: number
  @Expose({ name: 'max_capacity' }) @Transform(({ value }) => value ?? 0) maxCapacity!: number
  @Expose({ name: 'load_percentage' }) @Transform(({ value }) => value ?? 0) loadPercentage!: number
  @Expose({ name: 'waiting_in_queue' }) @Transform(({ value }) => value ?? 0) waitingInQueue!: number

  static fromJson(json: unknown): PlatformConcurrencyInfoDto {
    return plainToInstance(PlatformConcurrencyInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PlatformConcurrencyInfo {
    const e = new PlatformConcurrencyInfo()
    e.platform = this.platform
    e.currentInUse = this.currentInUse
    e.maxCapacity = this.maxCapacity
    e.loadPercentage = this.loadPercentage
    e.waitingInQueue = this.waitingInQueue
    return e
  }
}

export class GroupConcurrencyInfoDto {
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'group_name' }) @Transform(({ value }) => value ?? '') groupName!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'current_in_use' }) @Transform(({ value }) => value ?? 0) currentInUse!: number
  @Expose({ name: 'max_capacity' }) @Transform(({ value }) => value ?? 0) maxCapacity!: number
  @Expose({ name: 'load_percentage' }) @Transform(({ value }) => value ?? 0) loadPercentage!: number
  @Expose({ name: 'waiting_in_queue' }) @Transform(({ value }) => value ?? 0) waitingInQueue!: number

  static fromJson(json: unknown): GroupConcurrencyInfoDto {
    return plainToInstance(GroupConcurrencyInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GroupConcurrencyInfo {
    const e = new GroupConcurrencyInfo()
    e.groupId = this.groupId
    e.groupName = this.groupName
    e.platform = this.platform
    e.currentInUse = this.currentInUse
    e.maxCapacity = this.maxCapacity
    e.loadPercentage = this.loadPercentage
    e.waitingInQueue = this.waitingInQueue
    return e
  }
}

export class AccountConcurrencyInfoDto {
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose({ name: 'account_name' }) @Transform(({ value }) => value ?? '') accountName!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'group_name' }) @Transform(({ value }) => value ?? '') groupName!: string
  @Expose({ name: 'current_in_use' }) @Transform(({ value }) => value ?? 0) currentInUse!: number
  @Expose({ name: 'max_capacity' }) @Transform(({ value }) => value ?? 0) maxCapacity!: number
  @Expose({ name: 'load_percentage' }) @Transform(({ value }) => value ?? 0) loadPercentage!: number
  @Expose({ name: 'waiting_in_queue' }) @Transform(({ value }) => value ?? 0) waitingInQueue!: number

  static fromJson(json: unknown): AccountConcurrencyInfoDto {
    return plainToInstance(AccountConcurrencyInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountConcurrencyInfo {
    const e = new AccountConcurrencyInfo()
    e.accountId = this.accountId
    e.accountName = this.accountName
    e.platform = this.platform
    e.groupId = this.groupId
    e.groupName = this.groupName
    e.currentInUse = this.currentInUse
    e.maxCapacity = this.maxCapacity
    e.loadPercentage = this.loadPercentage
    e.waitingInQueue = this.waitingInQueue
    return e
  }
}

export class OpsConcurrencyStatsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? {}) platform!: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? {}) group!: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? {}) account!: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? '') timestamp!: string

  static fromJson(json: unknown): OpsConcurrencyStatsDto {
    return plainToInstance(OpsConcurrencyStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsConcurrencyStats {
    const e = new OpsConcurrencyStats()
    e.enabled = this.enabled
    e.platform = Object.fromEntries(
      Object.entries(this.platform ?? {}).map(([k, v]) => [k, PlatformConcurrencyInfoDto.fromJson(v).toEntity()])
    )
    e.group = Object.fromEntries(
      Object.entries(this.group ?? {}).map(([k, v]) => [k, GroupConcurrencyInfoDto.fromJson(v).toEntity()])
    )
    e.account = Object.fromEntries(
      Object.entries(this.account ?? {}).map(([k, v]) => [k, AccountConcurrencyInfoDto.fromJson(v).toEntity()])
    )
    e.timestamp = this.timestamp
    return e
  }
}
