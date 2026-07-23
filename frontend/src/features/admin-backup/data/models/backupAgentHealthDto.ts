import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { BackupAgentHealth } from '@/features/admin-backup/domain/models/backupAgentHealth'
import { BackupAgentInfoDto } from '@/features/admin-backup/data/models/backupAgentInfoDto'

export class BackupAgentHealthDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? '') reason!: string
  @Expose({ name: 'socket_path' }) @Transform(({ value }) => value ?? '') socketPath!: string
  @Expose() @Type(() => BackupAgentInfoDto) agent?: BackupAgentInfoDto

  static fromJson(json: unknown): BackupAgentHealthDto {
    return plainToInstance(BackupAgentHealthDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BackupAgentHealth {
    const e = new BackupAgentHealth()
    e.enabled = this.enabled
    e.reason = this.reason
    e.socketPath = this.socketPath
    e.agent = this.agent ? this.agent.toEntity() : undefined
    return e
  }
}
