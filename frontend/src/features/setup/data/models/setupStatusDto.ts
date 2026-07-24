import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SetupStatus } from '@/features/setup/domain/models/setupStatus'

export class SetupStatusDto {
  @Expose({ name: 'needs_setup' })
  @Transform(({ value }) => value ?? false)
  needsSetup!: boolean

  @Expose()
  @Transform(({ value }) => value ?? '')
  step!: string

  static fromJson(json: unknown): SetupStatusDto {
    return plainToInstance(SetupStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SetupStatus {
    const entity = new SetupStatus()
    entity.needsSetup = this.needsSetup
    entity.step = this.step
    return entity
  }
}
