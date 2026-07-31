import 'reflect-metadata'
import { Expose, plainToInstance } from 'class-transformer'
import { UserDto } from '@/core/models/data/userDto'
import { CurrentUserResponse } from '@/features/auth/domain/models/currentUserResponse'

export class CurrentUserResponseDto extends UserDto {
  @Expose({ name: 'run_mode' })
  runMode?: 'standard' | 'simple'

  static override fromJson(json: unknown): CurrentUserResponseDto {
    return plainToInstance(CurrentUserResponseDto, json, { excludeExtraneousValues: true })
  }

  override toEntity(): CurrentUserResponse {
    const base = super.toEntity()
    const entity = new CurrentUserResponse()
    Object.assign(entity, base)
    entity.runMode = this.runMode
    return entity
  }
}
