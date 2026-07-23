/**
 * AdminClusterQueryRepository (interface). Per spec §5.2 R4.
 */
import type { ClusterStatusResponse } from '@/features/admin-cluster/domain/models/clusterStatusResponse'

export interface AdminClusterQueryRepository {
  getStatus(options?: { signal?: AbortSignal }): Promise<ClusterStatusResponse>
}
