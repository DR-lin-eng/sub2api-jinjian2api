import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UserMonitorDetail } from '@/features/channel-monitor-user/domain/models/userMonitorDetail'
import { UserMonitorModelDetailDto } from './userMonitorModelDetailDto'

export class UserMonitorDetailDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  provider!: string

  @Expose({ name: 'monitor_mode' })
  @Transform(({ value }) => value ?? '')
  monitorMode!: string

  @Expose({ name: 'group_name' })
  @Transform(({ value }) => value ?? '')
  groupName!: string

  @Expose()
  @Type(() => UserMonitorModelDetailDto)
  models!: UserMonitorModelDetailDto[]

  static fromJson(json: unknown): UserMonitorDetailDto {
    return plainToInstance(UserMonitorDetailDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserMonitorDetail {
    const e = new UserMonitorDetail()
    e.id = this.id
    e.name = this.name
    e.provider = this.provider as UserMonitorDetail['provider']
    e.monitorMode = this.monitorMode as UserMonitorDetail['monitorMode']
    e.groupName = this.groupName
    e.models = (this.models ?? []).map(d => d.toEntity())
    return e
  }
}
