import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ApiKeyUsageTrendPoint } from '@/features/admin-dashboard/domain/models/apiKeyUsageTrendPoint'

export class ApiKeyUsageTrendPointDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  date!: string

  @Expose({ name: 'api_key_id' })
  @Transform(({ value }) => value ?? 0)
  apiKeyId!: number

  @Expose({ name: 'key_name' })
  @Transform(({ value }) => value ?? '')
  keyName!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  requests!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  tokens!: number

  static fromJson(json: unknown): ApiKeyUsageTrendPointDto {
    return plainToInstance(ApiKeyUsageTrendPointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ApiKeyUsageTrendPoint {
    const entity = new ApiKeyUsageTrendPoint()
    entity.date = this.date
    entity.apiKeyId = this.apiKeyId
    entity.keyName = this.keyName
    entity.requests = this.requests
    entity.tokens = this.tokens
    return entity
  }
}
