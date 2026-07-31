import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminUser } from '@/features/admin-users/domain/models/adminUser'

export class AdminUserDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  username!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  email!: string

  @Expose()
  @Transform(({ value }) => value ?? 'user')
  role!: 'admin' | 'user'

  @Expose()
  @Transform(({ value }) => value ?? 0)
  balance!: number

  @Expose({ name: 'frozen_balance' })
  @Transform(({ value }) => value ?? 0)
  frozenBalance!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  concurrency!: number

  @Expose({ name: 'rpm_limit' })
  @Transform(({ value }) => value ?? 0)
  rpmLimit!: number

  @Expose()
  @Transform(({ value }) => value ?? 'active')
  status!: 'active' | 'disabled'

  @Expose({ name: 'allowed_groups' })
  @Transform(({ value }) => value ?? null)
  allowedGroups!: number[] | null

  @Expose()
  @Transform(({ value }) => value ?? '')
  notes!: string

  @Expose({ name: 'last_used_at' })
  @Transform(({ value }) => value ?? '')
  lastUsedAt!: string

  @Expose({ name: 'last_active_at' })
  @Transform(({ value }) => value ?? '')
  lastActiveAt!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  @Expose({ name: 'deleted_at' })
  @Transform(({ value }) => value ?? '')
  deletedAt!: string

  @Expose({ name: 'current_concurrency' })
  @Transform(({ value }) => value ?? 0)
  currentConcurrency!: number

  @Expose({ name: 'group_rates' })
  @Transform(({ value }) => value ?? {})
  groupRates!: Record<number, number>

  static fromJson(json: unknown): AdminUserDto {
    return plainToInstance(AdminUserDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminUser {
    const entity = new AdminUser()
    entity.id = this.id
    entity.username = this.username
    entity.email = this.email
    entity.role = this.role
    entity.balance = this.balance
    entity.frozenBalance = this.frozenBalance
    entity.concurrency = this.concurrency
    entity.rpmLimit = this.rpmLimit
    entity.status = this.status
    entity.allowedGroups = this.allowedGroups
    entity.notes = this.notes
    entity.lastUsedAt = this.lastUsedAt
    entity.lastActiveAt = this.lastActiveAt
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    entity.deletedAt = this.deletedAt
    entity.currentConcurrency = this.currentConcurrency
    entity.groupRates = this.groupRates
    return entity
  }
}
