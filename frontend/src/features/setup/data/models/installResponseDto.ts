import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { InstallResponse } from '@/features/setup/domain/models/installResponse'

export class InstallResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  message!: string

  @Expose()
  @Transform(({ value }) => value ?? false)
  restart!: boolean

  static fromJson(json: unknown): InstallResponseDto {
    return plainToInstance(InstallResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): InstallResponse {
    const entity = new InstallResponse()
    entity.message = this.message
    entity.restart = this.restart
    return entity
  }
}
