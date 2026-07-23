/**
 * useAdminBackup — thin orchestrator for the AdminBackup sub-domain.
 * Flattens Query + Action store state and methods per spec §8.
 */
import { useAdminBackupQueryStore } from '@/features/admin-backup/presentation/stores/adminBackupQueryStore'
import { useAdminBackupActionStore } from '@/features/admin-backup/presentation/stores/adminBackupActionStore'

export function useAdminBackup() {
  const queryStore = useAdminBackupQueryStore()
  const actionStore = useAdminBackupActionStore()
  return {
    ...queryStore,
    ...actionStore,
  }
}
