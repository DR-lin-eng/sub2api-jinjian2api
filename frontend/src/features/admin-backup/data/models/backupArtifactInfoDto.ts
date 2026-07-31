import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BackupArtifactInfo } from '@/features/admin-backup/domain/models/backupArtifactInfo'

export class BackupArtifactInfoDto {
  @Expose({ name: 'local_path' }) @Transform(({ value }) => value ?? '') localPath!: string
  @Expose({ name: 'size_bytes' }) @Transform(({ value }) => value ?? 0) sizeBytes!: number
  @Expose() @Transform(({ value }) => value ?? '') sha256!: string

  static fromJson(json: unknown): BackupArtifactInfoDto {
    return plainToInstance(BackupArtifactInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BackupArtifactInfo {
    const e = new BackupArtifactInfo()
    e.localPath = this.localPath
    e.sizeBytes = this.sizeBytes
    e.sha256 = this.sha256
    return e
  }
}
