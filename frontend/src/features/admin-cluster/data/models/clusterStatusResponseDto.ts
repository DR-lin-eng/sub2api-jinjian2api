import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ClusterStatusResponse } from '@/features/admin-cluster/domain/models/clusterStatusResponse'
import { ClusterDeploymentStatusDto } from '@/features/admin-cluster/data/models/clusterDeploymentStatusDto'
import { ClusterSummaryDto } from '@/features/admin-cluster/data/models/clusterSummaryDto'
import { ClusterInstanceDto } from '@/features/admin-cluster/data/models/clusterInstanceDto'
import { ClusterTaskRunDto } from '@/features/admin-cluster/data/models/clusterTaskRunDto'

export class ClusterStatusResponseDto {
  @Expose()
  @Type(() => ClusterDeploymentStatusDto)
  deployment!: ClusterDeploymentStatusDto

  @Expose()
  @Type(() => ClusterSummaryDto)
  summary!: ClusterSummaryDto

  @Expose()
  @Type(() => ClusterInstanceDto)
  @Transform(({ value }) => value ?? [])
  instances!: ClusterInstanceDto[]

  @Expose()
  @Type(() => ClusterTaskRunDto)
  @Transform(({ value }) => value ?? [])
  tasks!: ClusterTaskRunDto[]

  @Expose({ name: 'observed_at' })
  @Transform(({ value }) => value ?? '')
  observedAt!: string

  static fromJson(json: unknown): ClusterStatusResponseDto {
    return plainToInstance(ClusterStatusResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ClusterStatusResponse {
    const entity = new ClusterStatusResponse()
    entity.deployment = this.deployment.toEntity()
    entity.summary = this.summary.toEntity()
    entity.instances = this.instances.map(dto => dto.toEntity())
    entity.tasks = this.tasks.map(dto => dto.toEntity())
    entity.observedAt = this.observedAt
    return entity
  }
}
