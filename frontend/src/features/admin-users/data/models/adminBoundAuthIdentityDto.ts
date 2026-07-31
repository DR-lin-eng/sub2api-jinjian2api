import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AdminBoundAuthIdentity } from '@/features/admin-users/domain/models/adminBoundAuthIdentity'
import { AdminBoundAuthIdentityChannelDto } from '@/features/admin-users/data/models/adminBoundAuthIdentityChannelDto'

export class AdminBoundAuthIdentityDto {
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose({ name: 'provider_type' })
  @Transform(({ value }) => value ?? '')
  providerType!: string

  @Expose({ name: 'provider_key' })
  @Transform(({ value }) => value ?? '')
  providerKey!: string

  @Expose({ name: 'provider_subject' })
  @Transform(({ value }) => value ?? '')
  providerSubject!: string

  @Expose({ name: 'verified_at' })
  @Transform(({ value }) => value ?? '')
  verifiedAt!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  issuer!: string

  @Expose()
  @Transform(({ value }) => value ?? {})
  metadata!: Record<string, unknown>

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  @Expose()
  @Type(() => AdminBoundAuthIdentityChannelDto)
  channel?: AdminBoundAuthIdentityChannelDto

  static fromJson(json: unknown): AdminBoundAuthIdentityDto {
    return plainToInstance(AdminBoundAuthIdentityDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminBoundAuthIdentity {
    const entity = new AdminBoundAuthIdentity()
    entity.userId = this.userId
    entity.providerType = this.providerType
    entity.providerKey = this.providerKey
    entity.providerSubject = this.providerSubject
    entity.verifiedAt = this.verifiedAt
    entity.issuer = this.issuer
    entity.metadata = this.metadata
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    entity.channel = this.channel ? this.channel.toEntity() : undefined
    return entity
  }
}
