/**
 * useAdminCluster — thin orchestrator composable per spec §5.5 R6.
 * Aggregates AdminClusterQueryStore and flattens its interface.
 */
import { useAdminClusterQueryStore } from '@/features/admin-cluster/presentation/stores/adminClusterQueryStore'

export function useAdminCluster() {
  const queryStore = useAdminClusterQueryStore()
  return {
    ...queryStore,
  }
}
