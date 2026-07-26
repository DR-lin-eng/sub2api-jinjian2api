import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CustomEndpoint } from '@/core/models/domain/customEndpoint'

export class CustomEndpointDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  endpoint!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  static fromJson(json: unknown): CustomEndpointDto {
    return plainToInstance(CustomEndpointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CustomEndpoint {
    const e = new CustomEndpoint()
    e.name = this.name
    e.endpoint = this.endpoint
    e.description = this.description
    return e
  }
}
