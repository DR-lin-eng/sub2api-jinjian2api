import type { ClusterDeploymentStatus } from '@/features/admin-cluster/domain/models/clusterDeploymentStatus'
import type { ClusterSummary } from '@/features/admin-cluster/domain/models/clusterSummary'
import type { ClusterInstance } from '@/features/admin-cluster/domain/models/clusterInstance'
import type { ClusterTaskRun } from '@/features/admin-cluster/domain/models/clusterTaskRun'

export class ClusterStatusResponse {
  deployment!: ClusterDeploymentStatus
  summary!: ClusterSummary
  instances!: ClusterInstance[]
  tasks!: ClusterTaskRun[]
  observedAt!: string
}
