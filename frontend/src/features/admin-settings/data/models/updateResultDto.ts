import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UpdateResult } from '@/features/admin-settings/domain/models/updateResult'

export class UpdateResultDto {
  @Expose() @Transform(({ value }) => value ?? '') message!: string
  @Expose({ name: 'need_restart' }) @Transform(({ value }) => value ?? false) needRestart!: boolean

  static fromJson(json: unknown): UpdateResultDto {
    return plainToInstance(UpdateResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UpdateResult {
    const e = new UpdateResult()
    e.message = this.message
    e.needRestart = this.needRestart
    return e
  }
}
