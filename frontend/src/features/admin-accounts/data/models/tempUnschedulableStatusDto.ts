import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { TempUnschedulableStatus } from '@/features/admin-accounts/domain/models/tempUnschedulableStatus'
import { TempUnschedulableStateDto } from '@/features/admin-accounts/data/models/tempUnschedulableStateDto'

export class TempUnschedulableStatusDto {
  @Expose() @Transform(({ value }) => value ?? false) active!: boolean
  @Expose() @Type(() => TempUnschedulableStateDto) state?: TempUnschedulableStateDto

  static fromJson(json: unknown): TempUnschedulableStatusDto {
    return plainToInstance(TempUnschedulableStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TempUnschedulableStatus {
    const e = new TempUnschedulableStatus()
    e.active = this.active
    e.state = this.state ? this.state.toEntity() : undefined
    return e
  }
}
