/**
 * useDataManagement — thin orchestrator for the DataManagement sub-domain.
 * Flattens Query + Action store state and methods per spec §8.
 */
import { useDataManagementQueryStore } from '@/features/admin-backup/presentation/stores/dataManagementQueryStore'
import { useDataManagementActionStore } from '@/features/admin-backup/presentation/stores/dataManagementActionStore'

export function useDataManagement() {
  const queryStore = useDataManagementQueryStore()
  const actionStore = useDataManagementActionStore()
  return {
    ...queryStore,
    ...actionStore,
  }
}
