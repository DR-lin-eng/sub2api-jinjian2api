import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SimpleApiKey } from '@/features/admin-usage/domain/models/simpleApiKey'

export class SimpleApiKeyDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number

  static fromJson(json: unknown): SimpleApiKeyDto {
    return plainToInstance(SimpleApiKeyDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SimpleApiKey {
    const e = new SimpleApiKey()
    e.id = this.id
    e.name = this.name
    e.userId = this.userId
    return e
  }
}
