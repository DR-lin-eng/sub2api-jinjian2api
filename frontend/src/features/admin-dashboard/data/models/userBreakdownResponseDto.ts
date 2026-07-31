import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { UserBreakdownItemDto } from './userBreakdownItemDto'
import { UserBreakdownResponse } from '@/features/admin-dashboard/domain/models/userBreakdownResponse'

export class UserBreakdownResponseDto {
  @Expose()
  @Type(() => UserBreakdownItemDto)
  users!: UserBreakdownItemDto[]

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  static fromJson(json: unknown): UserBreakdownResponseDto {
    return plainToInstance(UserBreakdownResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserBreakdownResponse {
    const entity = new UserBreakdownResponse()
    entity.users = (this.users ?? []).map(d => d.toEntity())
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    return entity
  }
}
