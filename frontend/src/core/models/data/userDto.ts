import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { User } from '@/core/models/domain/user'

export class UserDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') username!: string
  @Expose() @Transform(({ value }) => value ?? '') email!: string
  @Expose() @Transform(({ value }) => value ?? 'user') role!: 'admin' | 'user'
  @Expose() @Transform(({ value }) => value ?? 0) balance!: number
  @Expose() @Transform(({ value }) => value ?? 0) concurrency!: number
  @Expose() @Transform(({ value }) => value ?? 'active') status!: 'active' | 'disabled'
  @Expose({ name: 'balance_notify_enabled' }) @Transform(({ value }) => value ?? false) balanceNotifyEnabled!: boolean
  @Expose({ name: 'balance_notify_threshold' }) @Transform(({ value }) => value ?? null) balanceNotifyThreshold!: number | null
  @Expose({ name: 'balance_notify_extra_emails' }) @Transform(({ value }) => value ?? []) balanceNotifyExtraEmails!: unknown[]
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string
  @Expose({ name: 'frozen_balance' }) @Transform(({ value }) => value ?? 0) frozenBalance!: number
  @Expose({ name: 'rpm_limit' }) @Transform(({ value }) => value ?? 0) rpmLimit!: number
  @Expose({ name: 'allowed_groups' }) @Transform(({ value }) => value ?? null) allowedGroups!: number[] | null
  @Expose({ name: 'last_active_at' }) @Transform(({ value }) => value ?? null) lastActiveAt!: string | null
  @Expose({ name: 'deleted_at' }) @Transform(({ value }) => value ?? null) deletedAt!: string | null
  @Expose({ name: 'avatar_url' }) @Transform(({ value }) => value ?? null) avatarUrl!: string | null
  @Expose({ name: 'avatar_source' }) @Transform(({ value }) => value ?? null) avatarSource!: unknown
  @Expose({ name: 'username_source' }) @Transform(({ value }) => value ?? null) usernameSource!: unknown
  @Expose({ name: 'display_name_source' }) @Transform(({ value }) => value ?? null) displayNameSource!: unknown
  @Expose({ name: 'nickname_source' }) @Transform(({ value }) => value ?? null) nicknameSource!: unknown
  @Expose({ name: 'profile_sources' }) @Transform(({ value }) => value ?? null) profileSources!: unknown
  @Expose({ name: 'auth_bindings' }) @Transform(({ value }) => value ?? null) authBindings!: unknown
  @Expose({ name: 'identity_bindings' }) @Transform(({ value }) => value ?? null) identityBindings!: unknown
  @Expose({ name: 'email_bound' }) @Transform(({ value }) => value ?? false) emailBound!: boolean
  @Expose({ name: 'linuxdo_bound' }) @Transform(({ value }) => value ?? false) linuxdoBound!: boolean
  @Expose({ name: 'oidc_bound' }) @Transform(({ value }) => value ?? false) oidcBound!: boolean
  @Expose({ name: 'wechat_bound' }) @Transform(({ value }) => value ?? false) wechatBound!: boolean

  static fromJson(json: unknown): UserDto {
    return plainToInstance(UserDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): User {
    const e = new User()
    e.id = this.id
    e.username = this.username
    e.email = this.email
    e.role = this.role
    e.balance = this.balance
    e.concurrency = this.concurrency
    e.status = this.status
    e.balanceNotifyEnabled = this.balanceNotifyEnabled
    e.balanceNotifyThreshold = this.balanceNotifyThreshold
    e.balanceNotifyExtraEmails = this.balanceNotifyExtraEmails as never
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    e.frozenBalance = this.frozenBalance
    e.rpmLimit = this.rpmLimit
    e.allowedGroups = this.allowedGroups
    e.lastActiveAt = this.lastActiveAt
    e.deletedAt = this.deletedAt
    e.avatarUrl = this.avatarUrl
    e.avatarSource = this.avatarSource as never
    e.usernameSource = this.usernameSource as never
    e.displayNameSource = this.displayNameSource as never
    e.nicknameSource = this.nicknameSource as never
    e.profileSources = this.profileSources as never
    e.authBindings = this.authBindings as never
    e.identityBindings = this.identityBindings as never
    e.emailBound = this.emailBound
    e.linuxdoBound = this.linuxdoBound
    e.oidcBound = this.oidcBound
    e.wechatBound = this.wechatBound
    return e
  }
}
