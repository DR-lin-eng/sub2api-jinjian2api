import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { ClusterInstanceStatus } from '@/features/admin-cluster/enums/clusterInstanceStatus'
import { ClusterInstance } from '@/features/admin-cluster/domain/models/clusterInstance'

export class ClusterInstanceDto {
  @Expose({ name: 'runner_id' })
  @Transform(({ value }) => value ?? '')
  runnerId!: string

  @Expose({ name: 'node_name' })
  @Transform(({ value }) => value ?? '')
  nodeName!: string

  @Expose({ name: 'deployment_mode' })
  @Transform(({ value }) => value ?? '')
  deploymentMode!: string

  @Expose({ name: 'worker_mode' })
  @Transform(({ value }) => value ?? '')
  workerMode!: string

  @Expose({ name: 'worker_enabled' })
  @Transform(({ value }) => value ?? false)
  workerEnabled!: boolean

  @Expose()
  @Transform(({ value }) => value ?? '')
  version!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  hostname!: string

  @Expose({ name: 'process_id' })
  @Transform(({ value }) => value ?? 0)
  processId!: number

  @Expose({ name: 'database_ok' })
  @Transform(({ value }) => value ?? false)
  databaseOk!: boolean

  @Expose({ name: 'redis_ok' })
  @Transform(({ value }) => value ?? false)
  redisOk!: boolean

  @Expose({ name: 'started_at' })
  @Transform(({ value }) => value ?? '')
  startedAt!: string

  @Expose({ name: 'last_seen_at' })
  @Transform(({ value }) => value ?? '')
  lastSeenAt!: string

  @Expose({ name: 'stopped_at' })
  @Transform(({ value }) => value ?? '')
  stoppedAt!: string

  @Expose()
  status!: ClusterInstanceStatus

  @Expose()
  @Transform(({ value }) => value ?? false)
  current!: boolean

  static fromJson(json: unknown): ClusterInstanceDto {
    return plainToInstance(ClusterInstanceDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ClusterInstance {
    const entity = new ClusterInstance()
    entity.runnerId = this.runnerId
    entity.nodeName = this.nodeName
    entity.deploymentMode = this.deploymentMode
    entity.workerMode = this.workerMode
    entity.workerEnabled = this.workerEnabled
    entity.version = this.version
    entity.hostname = this.hostname
    entity.processId = this.processId
    entity.databaseOk = this.databaseOk
    entity.redisOk = this.redisOk
    entity.startedAt = this.startedAt
    entity.lastSeenAt = this.lastSeenAt
    entity.stoppedAt = this.stoppedAt
    entity.status = this.status
    entity.current = this.current
    return entity
  }
}
