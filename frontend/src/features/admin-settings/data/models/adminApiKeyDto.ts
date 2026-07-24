import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminApiKey } from '@/features/admin-settings/domain/models/adminApiKey'
import type { AdminApiKeyScope } from '@/features/admin-settings/domain/models/adminApiKey'

export class AdminApiKeyDto {
  @Expose() @Transform(({ value }) => value ?? '') id!: string
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose({ name: 'key_prefix' }) @Transform(({ value }) => value ?? '') keyPrefix!: string
  @Expose({ name: 'last_four' }) @Transform(({ value }) => value ?? '') lastFour!: string
  @Expose() @Transform(({ value }) => value ?? []) scopes!: AdminApiKeyScope[]
  @Expose() @Transform(({ value }) => value ?? '') status!: string
  @Expose({ name: 'expires_at' }) expiresAt?: string | null
  @Expose({ name: 'created_by' }) @Transform(({ value }) => value ?? 0) createdBy!: number
  @Expose({ name: 'last_used_at' }) lastUsedAt?: string | null
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string
  @Expose({ name: 'revoked_at' }) revokedAt?: string | null

  static fromJson(json: unknown): AdminApiKeyDto {
    return plainToInstance(AdminApiKeyDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminApiKey {
    const e = new AdminApiKey()
    e.id = this.id
    e.name = this.name
    e.keyPrefix = this.keyPrefix
    e.lastFour = this.lastFour
    e.scopes = this.scopes
    e.status = this.status
    e.expiresAt = this.expiresAt
    e.createdBy = this.createdBy
    e.lastUsedAt = this.lastUsedAt
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    e.revokedAt = this.revokedAt
    return e
  }
}
