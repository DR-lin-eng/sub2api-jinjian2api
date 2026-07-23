import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { ClusterTaskStatus } from '@/features/admin-cluster/domain/models/clusterTaskStatus'
import { ClusterTaskRun } from '@/features/admin-cluster/domain/models/clusterTaskRun'

export class ClusterTaskRunDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'run_id' })
  @Transform(({ value }) => value ?? '')
  runId!: string

  @Expose({ name: 'task_key' })
  @Transform(({ value }) => value ?? '')
  taskKey!: string

  @Expose()
  status!: ClusterTaskStatus

  @Expose({ name: 'node_name' })
  @Transform(({ value }) => value ?? '')
  nodeName!: string

  @Expose({ name: 'runner_id' })
  @Transform(({ value }) => value ?? '')
  runnerId!: string

  @Expose()
  @Transform(({ value }) => value ?? {})
  metadata!: Record<string, unknown>

  @Expose()
  @Transform(({ value }) => value ?? {})
  result!: Record<string, unknown>

  @Expose({ name: 'error_message' })
  @Transform(({ value }) => value ?? '')
  errorMessage!: string

  @Expose({ name: 'started_at' })
  @Transform(({ value }) => value ?? '')
  startedAt!: string

  @Expose({ name: 'heartbeat_at' })
  @Transform(({ value }) => value ?? '')
  heartbeatAt!: string

  @Expose({ name: 'lease_until' })
  @Transform(({ value }) => value ?? '')
  leaseUntil!: string

  @Expose({ name: 'finished_at' })
  @Transform(({ value }) => value ?? '')
  finishedAt!: string

  static fromJson(json: unknown): ClusterTaskRunDto {
    return plainToInstance(ClusterTaskRunDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ClusterTaskRun {
    const entity = new ClusterTaskRun()
    entity.id = this.id
    entity.runId = this.runId
    entity.taskKey = this.taskKey
    entity.status = this.status
    entity.nodeName = this.nodeName
    entity.runnerId = this.runnerId
    entity.metadata = this.metadata
    entity.result = this.result
    entity.errorMessage = this.errorMessage
    entity.startedAt = this.startedAt
    entity.heartbeatAt = this.heartbeatAt
    entity.leaseUntil = this.leaseUntil
    entity.finishedAt = this.finishedAt
    return entity
  }
}
