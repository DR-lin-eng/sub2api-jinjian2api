import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ClusterSummary } from '@/features/admin-cluster/domain/models/clusterSummary'

export class ClusterSummaryDto {
  @Expose({ name: 'online_nodes' })
  @Transform(({ value }) => value ?? 0)
  onlineNodes!: number

  @Expose({ name: 'stale_nodes' })
  @Transform(({ value }) => value ?? 0)
  staleNodes!: number

  @Expose({ name: 'stopped_nodes' })
  @Transform(({ value }) => value ?? 0)
  stoppedNodes!: number

  @Expose({ name: 'worker_nodes' })
  @Transform(({ value }) => value ?? 0)
  workerNodes!: number

  @Expose({ name: 'active_tasks' })
  @Transform(({ value }) => value ?? 0)
  activeTasks!: number

  @Expose({ name: 'unhealthy_nodes' })
  @Transform(({ value }) => value ?? 0)
  unhealthyNodes!: number

  static fromJson(json: unknown): ClusterSummaryDto {
    return plainToInstance(ClusterSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ClusterSummary {
    const entity = new ClusterSummary()
    entity.onlineNodes = this.onlineNodes
    entity.staleNodes = this.staleNodes
    entity.stoppedNodes = this.stoppedNodes
    entity.workerNodes = this.workerNodes
    entity.activeTasks = this.activeTasks
    entity.unhealthyNodes = this.unhealthyNodes
    return entity
  }
}
