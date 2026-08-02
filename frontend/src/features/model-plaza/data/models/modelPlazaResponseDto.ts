import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ModelPlazaResponse } from '@/features/model-plaza/domain/models/modelPlazaResponse'
import { ModelPlazaGroupDto } from './modelPlazaGroupDto'

export class ModelPlazaResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose()
  @Transform(({ value }) => value ?? [])
  @Type(() => ModelPlazaGroupDto)
  groups!: ModelPlazaGroupDto[]

  static fromJson(json: unknown): ModelPlazaResponseDto {
    return plainToInstance(ModelPlazaResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelPlazaResponse {
    const entity = new ModelPlazaResponse()
    entity.description = this.description
    entity.groups = (this.groups ?? []).map(group => group.toEntity())
    return entity
  }
}
