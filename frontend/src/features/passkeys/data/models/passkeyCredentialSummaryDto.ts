import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PasskeyCredentialSummary } from '@/features/passkeys/domain/models/passkeyCredentialSummary'

export class PasskeyCredentialSummaryDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'last_used_at' })
  lastUsedAt?: string

  @Expose()
  @Transform(({ value }) => value ?? false)
  backup!: boolean

  static fromJson(json: unknown): PasskeyCredentialSummaryDto {
    return plainToInstance(PasskeyCredentialSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PasskeyCredentialSummary {
    const entity = new PasskeyCredentialSummary()
    entity.id = this.id
    entity.name = this.name
    entity.createdAt = this.createdAt
    entity.lastUsedAt = this.lastUsedAt
    entity.backup = this.backup
    return entity
  }
}
