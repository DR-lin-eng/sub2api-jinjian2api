import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BackupAgentInfo } from '@/features/admin-backup/domain/models/backupAgentInfo'

export class BackupAgentInfoDto {
  @Expose() @Transform(({ value }) => value ?? '') status!: string
  @Expose() @Transform(({ value }) => value ?? '') version!: string
  @Expose({ name: 'uptime_seconds' }) @Transform(({ value }) => value ?? 0) uptimeSeconds!: number

  static fromJson(json: unknown): BackupAgentInfoDto {
    return plainToInstance(BackupAgentInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BackupAgentInfo {
    const e = new BackupAgentInfo()
    e.status = this.status
    e.version = this.version
    e.uptimeSeconds = this.uptimeSeconds
    return e
  }
}
