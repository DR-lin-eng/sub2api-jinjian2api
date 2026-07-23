/**
 * useAdminAudit — thin orchestrator composable. Per spec §8.
 * Flattens Query + Action store state and methods into a single interface.
 */
import { useAdminAuditQueryStore } from '@/features/admin-audit/presentation/stores/adminAuditQueryStore'
import { useAdminAuditActionStore } from '@/features/admin-audit/presentation/stores/adminAuditActionStore'

export function useAdminAudit() {
  const queryStore = useAdminAuditQueryStore()
  const actionStore = useAdminAuditActionStore()
  return {
    ...queryStore,
    ...actionStore,
  }
}
