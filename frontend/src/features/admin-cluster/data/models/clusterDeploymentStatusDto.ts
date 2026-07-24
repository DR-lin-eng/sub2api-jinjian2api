import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { ClusterDeploymentMode } from '@/features/admin-cluster/enums/clusterDeploymentMode'
import type { ClusterWorkerMode } from '@/features/admin-cluster/enums/clusterWorkerMode'
import { ClusterDeploymentStatus } from '@/features/admin-cluster/domain/models/clusterDeploymentStatus'

export class ClusterDeploymentStatusDto {
  @Expose()
  @Transform(({ value }) => value ?? 'standalone')
  mode!: ClusterDeploymentMode

  @Expose({ name: 'node_name' })
  @Transform(({ value }) => value ?? '')
  nodeName!: string

  @Expose({ name: 'runner_id' })
  @Transform(({ value }) => value ?? '')
  runnerId!: string

  @Expose({ name: 'worker_mode' })
  @Transform(({ value }) => value ?? 'auto')
  workerMode!: ClusterWorkerMode

  @Expose({ name: 'worker_enabled' })
  @Transform(({ value }) => value ?? false)
  workerEnabled!: boolean

  @Expose({ name: 'frontend_enabled' })
  @Transform(({ value }) => value ?? false)
  frontendEnabled!: boolean

  @Expose({ name: 'heartbeat_interval_seconds' })
  @Transform(({ value }) => value ?? 0)
  heartbeatIntervalSeconds!: number

  @Expose({ name: 'stale_after_seconds' })
  @Transform(({ value }) => value ?? 0)
  staleAfterSeconds!: number

  @Expose({ name: 'task_lease_seconds' })
  @Transform(({ value }) => value ?? 0)
  taskLeaseSeconds!: number

  static fromJson(json: unknown): ClusterDeploymentStatusDto {
    return plainToInstance(ClusterDeploymentStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ClusterDeploymentStatus {
    const entity = new ClusterDeploymentStatus()
    entity.mode = this.mode
    entity.nodeName = this.nodeName
    entity.runnerId = this.runnerId
    entity.workerMode = this.workerMode
    entity.workerEnabled = this.workerEnabled
    entity.frontendEnabled = this.frontendEnabled
    entity.heartbeatIntervalSeconds = this.heartbeatIntervalSeconds
    entity.staleAfterSeconds = this.staleAfterSeconds
    entity.taskLeaseSeconds = this.taskLeaseSeconds
    return entity
  }
}
